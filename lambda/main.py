# coding: UTF-8

from __future__ import print_function

import cv2
import numpy as np
import boto3
import uuid
import json
import random

s3 = boto3.client('s3')

def get_config_from_s3(bucket, folder, file):
    tmp_config_filename = '/tmp/' + file
    key = folder + file
    s3.download_file(Bucket = bucket, Key = key, Filename = tmp_config_filename)
    with open(tmp_config_filename, 'r') as f:
        config = json.load(f)
    return config

def get_image_from_s3(bucket, folder, file):
    tmp_image_filename = '/tmp/' + uuid.uuid4().hex + file
    key = folder + file
    s3.download_file(Bucket = bucket, Key = key, Filename = tmp_image_filename)
    return cv2.imread(tmp_image_filename)

def face_detector(image):
    # minify image
    height, width = image.shape[:2]
    MAX_WIDTH = 800
    if width > MAX_WIDTH:
        minify_factor = 1.0 * MAX_WIDTH / width
    else:
        minify_factor = 1.0
    minify_image_size = (int(width * minify_factor), int(height * minify_factor))
    minify_image = cv2.resize(image, minify_image_size, cv2.INTER_LINEAR)

    # gray
    gray_minify_image  = cv2.cvtColor(minify_image, cv2.COLOR_BGR2GRAY)
    faceCascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
    minify_faces = faceCascade.detectMultiScale(gray_minify_image, 1.1, 3)

    faces = [[int(v / minify_factor) for v in face] for face in minify_faces]
    return faces

def trim_image(image, rect): # rect = [x, y, width, height]
    x, y, width, height = rect
    return image[y:y + height, x:x + width]

def put_image_to_s3(image, bucket, folder, file):
    tmp_image_filename = '/tmp/' + uuid.uuid4().hex + file
    cv2.imwrite(tmp_image_filename, image)
    key = folder + file
    s3.upload_file(Filename = tmp_image_filename, Bucket = bucket, Key = key)

def signed_url(bucket, folder, file):
    key = folder + file
    return s3.generate_presigned_url(
        ClientMethod='get_object',
        Params={
            'Bucket': bucket,
            'Key': key
        },
        ExpiresIn = 600,
        HttpMethod = 'GET'
    )


########################################################
def lambda_handler(event, context):
    #
    S3_BUCKET           = 'naritaijinsei'
    S3_OUTPUT_FOLDER    = 'output/'
    S3_INPUT_FOLDER     = 'input/'
    S3_UTIL_FOLDER      = 'util/'

    config  = get_config_from_s3(bucket = S3_BUCKET, folder = S3_UTIL_FOLDER, file = event["config"])

    # get images
    source_image    = get_image_from_s3(bucket = S3_BUCKET, folder = S3_INPUT_FOLDER,file = event["source_image"])
    base_image      = get_image_from_s3(bucket = S3_BUCKET, folder = S3_UTIL_FOLDER, file = config["base_image"])
    mask_image      = get_image_from_s3(bucket = S3_BUCKET, folder = S3_UTIL_FOLDER, file = config["mask_image"])

    # face detection
    faces = face_detector(source_image) # = [[x0, y0, w0, h0], ... ]
    if len(faces) > 0:
        face = random.choice(faces)
        face_image = trim_image(source_image, face)
    else:
        return { "error": "cannot find faces" }

    # merge images
    sized_face_image  = cv2.resize(face_image,(mask_image.shape[0],mask_image.shape[1]),cv2.INTER_CUBIC)
    cx, xy = config["center"]
    center = (cx, xy)
    output_image    = cv2.seamlessClone(sized_face_image, base_image, mask_image, center, cv2.NORMAL_CLONE)

    # upload image to S3
    generated_image_filename = uuid.uuid4().hex + '.png';
    put_image_to_s3(image = output_image, bucket = S3_BUCKET, folder = S3_OUTPUT_FOLDER, file = generated_image_filename)

    # get signed url of uploaded image file
    image_url = signed_url(bucket = S3_BUCKET, folder = S3_OUTPUT_FOLDER, file = generated_image_filename)

    return { "image_url": image_url }
