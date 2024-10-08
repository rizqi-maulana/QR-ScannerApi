export function checkDomainProtocol(domain: string) {
  return new Promise((resolve, reject) => {
    fetch(`https://${domain}`)
      .then(res => {
        console.log(res);
        resolve('https');
      })
      .catch(err => {
        console.log(err);
        fetch(`http://${domain}`)
          .then(res => {
            console.log(res);
            resolve('http');
          })
          .catch(err => {
            console.log(err);
            reject('Domain tidak valid atau tidak dapat dijangkau');
          });
      });
  });
}
