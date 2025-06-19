export const getEmployeePhotoUrl = (empid, extension = 'png') => {
  // return `/photos/${empid}.${extension}`;
  //  return `../../../photos/${empid}.${extension}`;
  return `http://localhost:9000/photos/${empid}.${extension}`;
};

export const getDefaultPhotoUrl = () => 'http://localhost:9000/photos/defimg.jpg';