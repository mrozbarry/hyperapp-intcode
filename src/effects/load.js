const getCodeString = (locationSource) => {
  const search = locationSource && locationSource.search
    ? locationSource.search.replace(/^\?/, '')
    : '';

  const params = search.split('&');
  const codeParam = params.find(p => p.startsWith('code='));
  if (!codeParam) {
    return null;
  }

  const [_, codeString] = codeParam.split('=');
  const decoded = decodeURIComponent(codeString).trim();
  const noNewLines = decoded.replace(/[^0-9,]/g, '');
  return noNewLines;
};

const LoadFX = (dispatch, { onLoad, onError, locationSource }) => {
  const codeString = getCodeString(locationSource);
  if (codeString === null) {
    return;
  }

  const code = codeString.split(',').map(Number);
  const verification = code.join(',');
  if (codeString !== verification) {
    dispatch(onError, 'Invalid code supplied');
    return;
  }

  dispatch(onLoad, code);
};

export const Load = props => [LoadFX, props];
