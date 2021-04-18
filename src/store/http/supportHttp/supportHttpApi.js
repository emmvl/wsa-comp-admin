import supportHttp from './supportHttp';

let supportHttpApi = {
  // Get Help and Support content
  getSupportContent() {
    const url = 'help-and-supports';
    return Method.dataGet(url);
  },
};

let Method = {
  // Method to GET response
  async dataGet(newUrl) {
    const url = newUrl;
    return await new Promise((resolve, reject) => {
      supportHttp
        .get(url, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
            SourceSystem: 'WebAdmin',
          },
        })
        .then(result => {
          if (result.status === 200) {
            return resolve({
              status: 1,
              result: result,
            });
          } else if (result.status === 212) {
            return resolve({
              status: 4,
              result: result,
            });
          } else {
            if (result) {
              return reject({
                status: 3,
                error: result.data.message,
              });
            } else {
              return reject({
                status: 4,
                error: 'Something went wrong.',
              });
            }
          }
        })
        .catch(err => {
          console.log(err);

          return reject({
            status: 5,
            error: err,
          });
        });
    });
  },
};

export default supportHttpApi;
