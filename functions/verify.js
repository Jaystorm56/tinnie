exports.handler = async (event, context) => {
  console.log('Verify function invoked with event:', event);

  try {
    const { code, client } = event.queryStringParameters || {};
    const uniqueCode = code || 'Unknown Code';
    const clientName = client || 'Unknown Client';

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verified Report</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Poppins', sans-serif;
            color: white;
            text-align: center;
            padding: 20px;
            min-height: 100vh;
            width: 100%;
            background: url('https://pdf-upload-site.netlify.app/logo.jpeg') no-repeat center center fixed;
            background-size: cover; /* Scales logo to cover the entire background */
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
          }
          .main-sec {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            width: 90%; /* Responsive width */
            max-width: 1200px; /* Max width for large screens */
            min-height: 80vh;
            padding: 20px;
          }
          .card {
            width: 100%;
            max-width: 17em; /* Limits width on larger screens */
            min-height: 22.5em;
            background: rgba(23, 23, 23, 0.9); /* Semi-transparent for readability */
            transition: 0.3s ease-in-out;
            clip-path: polygon(30px 0%, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0% 30px);
            border-top-right-radius: 20px;
            border-bottom-left-radius: 20px;
            display: flex;
            flex-direction: column;
            margin: 10px auto;
            padding: 15px;
          }
          .card span {
            font-weight: bold;
            color: white;
            text-align: center;
            font-size: clamp(1em, 2.5vw, 1.2em); /* Responsive font size */
          }
          .card .info {
            font-weight: 400;
            color: white;
            text-align: center;
            font-size: clamp(0.72em, 2vw, 0.9em);
            margin: 1em;
          }
          .card .img {
            width: clamp(4.8em, 15vw, 6em); /* Responsive image size */
            height: clamp(4.8em, 15vw, 6em);
            border-radius: 15px;
            margin: 10px auto;
          }
          .card .img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 15px;
          }
          .cardd {
            overflow: hidden;
            position: relative;
            text-align: left;
            border-radius: 0.5rem;
            width: 100%;
            max-width: 790px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            background-color: #fff;
            margin: 20px auto;
            padding: 10px;
          }
          .header {
            padding: clamp(1rem, 3vw, 1.25rem) clamp(1rem, 2vw, 1rem);
          }
          .image {
            display: flex;
            margin-left: auto;
            margin-right: auto;
            background-color: #e2feee;
            flex-shrink: 0;
            justify-content: center;
            align-items: center;
            width: clamp(2.5rem, 8vw, 3rem);
            height: clamp(2.5rem, 8vw, 3rem);
            border-radius: 9999px;
            animation: animate 0.6s linear alternate-reverse infinite;
          }
          .image svg {
            color: #0afa2a;
            width: clamp(1.5rem, 5vw, 2rem);
            height: clamp(1.5rem, 5vw, 2rem);
          }
          .content {
            margin-top: 0.75rem;
            text-align: center;
          }
          .title {
            color: #066e29;
            font-size: clamp(1rem, 2.5vw, 1.2em);
            font-weight: 600;
            line-height: 1.5rem;
          }
          .message {
            margin-top: 0.5rem;
            color: #595b5f;
            font-size: clamp(0.875rem, 2vw, 1rem);
            line-height: 1.25rem;
          }
          @keyframes animate {
            from { transform: scale(1); }
            to { transform: scale(1.09); }
          }
          /* Responsive adjustments */
          @media (max-width: 768px) {
            .main-sec {
              flex-direction: column;
              min-height: auto;
              padding: 10px;
            }
            .card, .cardd {
              margin: 10px 0;
              width: 100%;
              max-width: none;
            }
          }
          @media (max-width: 480px) {
            body {
              padding: 10px;
            }
            .card {
              min-height: 18em;
            }
            .card .info {
              margin: 0.5em;
            }
          }
        </style>
      </head>
      <body>
        <div class="main-sec">
          <div class="card">
            <div class="img">
              <img src="https://pdf-upload-site.netlify.app/ppic.jpeg" alt="Profile Picture">
            </div>
            <span>About Us</span>
            <p class="info">
              Civil Craft Engineering Limited is an indigenous company duly registered according to the laws of Nigeria with a track record of delivering exceptional civil engineering solutions also experienced in quality control and assurance of construction materials, structural stability and integrity of existing structures and other civil engineering services. Our company combines technical expertise, innovative approaches, and a commitment excellence to provide tailored services to clients across various sectors. 
              With a strong focus on quality, safety, and customer satisfaction, Civil Craft Engineering Limited strives to build lasting relationships and contribute to the developments of Nigeria’s infrastructure
            </p>
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