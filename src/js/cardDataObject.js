const buildCardData = () => {
  const fontInput = document.querySelector('#font');
  const colorInput = document.querySelector('#color');
  const postcardMessage = document.querySelector('#postcardMessage');
  const postcardSignature = document.querySelector('#postcardSignature');
  const signatureInput = document.querySelector('#signature');

  const img = document.querySelector('#apodImage');

  return {
    photo: img?.src || '',
    field1: 1,
    field2: postcardMessage?.textContent || '',
    field3: fontInput?.value || '',
    field4: colorInput?.value || '',
    field5: postcardSignature?.textContent || signatureInput?.value || '',
  };
};

export default buildCardData;