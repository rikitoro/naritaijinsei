# coding: UTF-8

from __future__ import print_function

import cv2
import numpy as np
import boto3
import uuid
import json

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
    gray_image  = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faceCascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
    return faceCascade.detectMultiScale(gray_image, 1.1, 3)

def trim_image(image, rect): # rect = [x, y, width, height]
    x, y, width, height = rect
    return image[y:y + height, x:x + width]

def put_image_to_s3(image, bucket, folder, file):
    tmp_image_filename = '/tmp/' + uuid.uuid4().hex + file
    cv2.imwrite(tmp_image_filename, image)
    key = folder + file
    s3.upload_file(Filename = tmp_image_filename, Bucket = bucket, Key = key)
    signed_url = s3.generate_presigned_url(
        ClientMethod='get_object',
        Params={
            'Bucket': bucket,
            'Key': key
        },
        ExpiresIn = 600,
        HttpMethod = 'GET'
    )
    return signed_url


########################################################
def lambda_handler(event, context):
    #
    S3_BUCKET           = 'naritaijinsei'
    S3_OUTPUT_FOLDER    = 'output/'
    S3_INPUT_FOLDER     = 'input/'
    S3_UTIL_FOLDER      = 'util/'

    config  = get_config_from_s3(bucket = S3_BUCKET, folder = S3_UTIL_FOLDER, file = event["config"])

    # get images
    original_image    = get_image_from_s3(bucket = S3_BUCKET, folder = S3_INPUT_FOLDER,file = event["source_image"])

    base_image      = get_image_from_s3(bucket = S3_BUCKET, folder = S3_UTIL_FOLDER, file = config["base_image"])
    mask_image      = get_image_from_s3(bucket = S3_BUCKET, folder = S3_UTIL_FOLDER, file = config["mask_image"])
    # resize source image
    if original_image.shape[0] > 800:
        source_image    = cv2.resize(original_image, (800, 800 * original_image.shape[1]/original_image.shape[0]), cv2.INTER_LINEAR)
    else:
        source_image    = original_image

    # face detection
    faces = face_detector(source_image) # = [[x0, y0, w0, h0], ... ]
    if len(faces) > 0:
        face_image = trim_image(source_image, faces[0])
    else:
        return { "error": "cannot find faces" }

    # merge images
    sized_face_image  = cv2.resize(face_image,(mask_image.shape[0],mask_image.shape[1]),cv2.INTER_LINEAR)
    cx, xy = config["center"]
    center = (cx, xy)
    output_image    = cv2.seamlessClone(sized_face_image, base_image, mask_image, center, cv2.NORMAL_CLONE)

    # upload image to S3
    generated_image_filename = uuid.uuid4().hex + '.png';
    image_url = put_image_to_s3(
        image = output_image, bucket = S3_BUCKET, folder = S3_OUTPUT_FOLDER, file = generated_image_filename)

    # image_url = 'https://s3-ap-northeast-1.amazonaws.com/' + S3_BUCKET + '/' + S3_OUTPUT_FOLDER + generated_image_filename;
    return { "image_url": image_url }
