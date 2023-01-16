"use strict";

const {
  DocumentInterface,
  ApiResponse,
  ApiRequire,
  FileServer,
} = require("/opt/Common");

exports.lambdaHandler = async (event, context, callback) => {
  const requiredArgs = ["contentType"];
  const messageBody = JSON.parse(event.body);

  if (!ApiRequire.hasRequiredArgs(requiredArgs, messageBody)) {
    return ApiResponse.makeRequiredArgumentsError();
  }

  let { contentType, fileName } = messageBody;

  const fileId = context.awsRequestId;
  if (!fileName) {
    fileName = `${fileId}.${DocumentInterface.fileExtensionForContentType(
      contentType
    )}`;
  }

  // // const uploadBucket = process.env.UPLOAD_BUCKET;
  // const uploadUrl = DocumentInterface.getSignedUploadUrl(
  //   uploadBucket,
  //   fileName,
  //   contentType
  // );
  // await DocumentInterface.documentFileProvisioned(fileName);

  // // NOTE: Simple file server instead of AWS setup (above)
  const uploadUrl = FileServer.genUrl(fileName);

  return ApiResponse.makeResponse(200, {
    uploadUrl: uploadUrl,
    fileName: fileName,
  });
};
