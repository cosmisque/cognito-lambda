import  { useEffect } from 'react';

function ErrorMsg({ errors }:any) {
  const entries = Object.entries(errors);
  useEffect(() => {
    if (!errors) {
      return;
    }
  }, [errors]);

  return (
    <div>
      {entries.map(
        ([key, value] : any) =>
          value.type === 'required' && (
            <p style={{ color: 'red' }} key={key}>
              {`${key} is required`}
            </p>
          )
      )}
    </div>
  );
}

export default ErrorMsg;
