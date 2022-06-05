# Adding file upload to a website

In this section we go through what setup we need to do in client side, backend side and on database end to successfully provide a feature of file uploads to a site.

## Two sides of file uploads

- Client side
  - User should be able to select and preview a file
  - Submit form should include file + other data

- Server side
  - Incoming file should be extracted (just like other data)
  - File should be stored + possibly served as well

## Section overview

- The form element to provide file picker is input of type = file, and we can add the accept attribute to limit the type of files that can be selected.
- The form encoding type (enctype) must be set to "multipart/form-data" to be able to submit a file. The default enctype is application/x-www-form-urlencoded.
- In Node.js and Express.js we can use the "multer" middleware to parse the file(s) uploaded from UI.
- In general we don't store the file or image directly into DB, but store the file(s) into file system (or like S3 bucket), and in DB we can store the URL of the file location.
- In UI if we want to show a preview of the file being picked, we can use the input_element.files property and pick the first file lets say (files[0]). If we then put the pickedFile into URL.createObjectURL we will receive a URL back which we can put into image src attribute.
