exports.handler = async (event, context) => {
  console.log('Verify function invoked with event:', event);

  try {
    // Extract query parameters from the URL
    const { code, client } = event.queryStringParameters || {};
    const uniqueCode = code || 'Unknown Code';
    const clientName = client || 'Unknown Client';

    // Generate the HTML response
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verified Report</title>
        <style>
          body {
            font-family: poppins, sans-serif;
            color: white;
            text-align: center;
            padding: 20px;
            width: 100%;
            height: 100%;
            --s: 200px;
            --c1: #1d1d1d;
            --c2: #4e4f51;
            --c3: #3c3c3c;
            background: repeating-conic-gradient(
                  from 30deg,
                  #0000 0 120deg,
                  var(--c3) 0 180deg
                )
                calc(0.5 * var(--s)) calc(0.5 * var(--s) * 0.577),
              repeating-conic-gradient(
                from 30deg,
                var(--c1) 0 60deg,
                var(--c2) 0 120deg,
                var(--c3) 0 180deg
              );
            background-size: var(--s) calc(var(--s) * 0.577);
          }
          .verified-icon {
            margin-top: 20px;
            width: 100px;
            animation: pulse 1.5s ease-in-out infinite;
          }
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
          }
          .card {
            width: 17em;
            height: 22.5em;
            background: #171717;
            transition: 1s ease-in-out;
            clip-path: polygon(30px 0%, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0% 30px);
            border-top-right-radius: 20px;
            border-bottom-left-radius: 20px;
            display: flex;
            flex-direction: column;
            margin: 0 auto;
          }
          .card span {
            font-weight: bold;
            color: white;
            text-align: center;
            display: block;
            font-size: 1em;
          }
          .card .info {
            font-weight: 400;
            color: white;
            display: block;
            text-align: center;
            font-size: 0.72em;
            margin: 1em;
          }
          .card .img {
            width: 4.8em;
            height: 4.8em;
            border-radius: 15px;
            margin: auto;
          }
          .cardd {
            overflow: hidden;
            position: relative;
            text-align: left;
            border-radius: 0.5rem;
            max-width: 790px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            background-color: #fff;
            margin: 20px auto;
          }
          .header {
            padding: 1.25rem 1rem 1rem 1rem;
          }
          .image {
            display: flex;
            margin-left: auto;
            margin-right: auto;
            background-color: #e2feee;
            flex-shrink: 0;
            justify-content: center;
            align-items: center;
            width: 3rem;
            height: 3rem;
            border-radius: 9999px;
            animation: animate .6s linear alternate-reverse infinite;
          }
          .image svg {
            color: #0afa2a;
            width: 2rem;
            height: 2rem;
          }
          .content {
            margin-top: 0.75rem;
;
            text-align: center;
          }
          .title {
            color: #066e29;
            font-size: 1rem;
            font-weight: 600;
            line-height: 1.5rem;
          }
          .message {
            margin-top: 0.5rem;
            color: #595b5f;
            font-size: 0.875rem;
            line-height: 1.25rem;
          }
          @keyframes animate {
            from { transform: scale(1); }
            to { transform: scale(1.09); }
          }
          .main-sec {
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
            justify-content: space-around;
            height: 95vh;
            width: 96%;
          }
        </style>
      </head>
      <body>
        <div class="main-sec">
          <div class="card">
            <div class="img">
            <img src="https://pdf-upload-site.netlify.app/ppic.jpeg" alt="Profile Picture">
            </div>
            <span>About Me</span>
            <p class="info">I’m Adewale Adetoun, a dedicated construction engineer specializing in testing and quality assurance. I focus on ensuring the structural integrity and safety of projects through rigorous testing and inspection. With a keen eye for detail and a commitment to excellence, I work to deliver reliable and durable results for every client.</p>
          </div>
          <div class="verified">
            <div class="cardd">
              <div class="header">
                <div class="image">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
                    <g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>
                    <g id="SVGRepo_iconCarrier">
                      <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" stroke="#000000" d="M20 7L9.00004 18L3.99994 13"></path>
                    </g>
                  </svg>
                </div>
                <div class="content">
                  <span class="title">Verified Report</span>
                  <p class="message">
                    This document with the unique code <strong>${uniqueCode}</strong> has been prepared exclusively for <strong>${clientName}</strong> by Civil Craft Engineering Limited and is not intended for use by any third party. No other person or entity may rely on it for any purpose whatsoever.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
      body: html,
    };
  } catch (err) {
    console.error('Error in verify function:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: `An error occurred: ${err.message}` }),
    };
  }
};