export const getEmployeePhotoUrl = (empid, extension = 'avif') => {
  return `/photos/${empid}.${extension}`;
};

export const getDefaultPhotoUrl = () => '/photos/defimg.jpg';