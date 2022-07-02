// DOM Elements
const imagePickerInput = document.getElementById('image');
const imagePreviewElement = document.querySelector('#image-upload-control img');

// Functions
const showImagePreview = () => {
  const files = imagePickerInput.files;
  if (!files || files.length === 0) {
    imagePreviewElement.style.display = none;
    return;
  }

  const pickedFile = files[0];
  imagePreviewElement.src = URL.createObjectURL(pickedFile);
  imagePreviewElement.style.display = 'block';
};

// Event Listeners
imagePickerInput.addEventListener('change', showImagePreview);
