// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async  function handler(req, res)  {
  return new Promise(resolve => {
    switch (req.method) {
      case "GET": {

        const verify_token = process.env.VERIFY_TOKEN;
               // Parse params from the webhook verification request
           // const query = NextApiRequest.query;
            // const { mode='hub.mode', token='hub.verify_token',challenge='hub.challenge'} = query;
            const {
                query: {kmode='hub.mode',ktoken='hub.verify_token',kchallenge='hub.challenge' },
                method,
              } = req;

            let mode = req.query['hub.mode'];
            let token = req.query['hub.verify_token'];
            let challenge = req.query['hub.challenge'];
            // Check if a token and mode were sent
             if (mode && token) {
                // Check the mode and token sent are correct
                if (mode === 'subscribe' && token === verify_token) {
                    // Respond with 200 OK and challenge token from the request
                    console.log('WEBHOOK_VERIFIED');
            return         res.status(200).send(challenge);
                } else {
                    // Responds with '403 Forbidden' if verify tokens do not match
                    res.status(403);
                    console.log('WEBHOOK_FAILS');
                }
            }
      }
      case "POST": {
        try {
          const request = http.request( // Node core http module
            url,
            {
              headers:   makeHeaders(req, res),
              method: req.method,
            },
            response => {
              response.pipe(res);
              resolve()
            },
          );

          request.write(JSON.stringify(req.body));
          console.log(req.body)
          request.end();
        } catch (error) {
          //Log.error(error); // Can be a simple console.error too
          res.status(500).end();
          return resolve()
        }
      }
     
      }

    
    
    res.status(405).end();
    
    return resolve()
    
  
  
})
};
