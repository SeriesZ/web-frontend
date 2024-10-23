import React from "react";

const PopupIframe = () => {
  const openPopup = () => {
    const popupWidth = 800;
    const popupHeight = 600;
    const left = (window.screen.width - popupWidth) / 2;
    const top = (window.screen.height - popupHeight) / 2;

    // 새로운 팝업 창 열기
    const popup = window.open(
      "",
      "PopupIframeWindow",
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );

    // 팝업 창이 제대로 열렸는지 확인
    if (popup) {
      // 팝업 창에 iframe 삽입
      popup.document.write(`
        <html>
          <head>
            <title>Google Meet</title>
          </head>
          <body style="margin:0; padding:0; overflow:hidden;">
            <iframe
              src="https://meet.google.com/landing"
              width="100%"
              height="100%"
              style="border:none;"
              allow="camera; microphone"
            ></iframe>
          </body>
        </html>
      `);
      popup.document.close();
    } else {
      alert(
        "팝업 창을 열 수 없습니다. 브라우저의 팝업 차단 기능을 확인해주세요."
      );
    }
  };

  return (
    <button onClick={openPopup} style={{ cursor: "pointer" }}>
      Google Meet 열기
    </button>
  );
};

export default PopupIframe;
