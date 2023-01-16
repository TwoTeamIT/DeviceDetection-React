const Image = ({ inputFileRef, image, imageSRC, setImageSRC }) => {
  //const [imageSRC, setImageSRC] = useState(null);

  function setImage(input) {
    let reader = new FileReader();

    reader.onload = function (e) {
      setImageSRC(e.target.result);
    };

    reader.readAsDataURL(input.files[0]);
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <input
        ref={inputFileRef}
        type="file"
        className="d-none"
        accept="image/*"
        onChange={(e) => setImage(e.target)}
      />
      <div
        className="d-flex justify-content-center align-items-center shadow bg-custom"
        style={{
          cursor: "pointer",
          width: "150px",
          height: "100px",
        }}
        onClick={() => {
          inputFileRef.current.click();
        }}
      >
        {imageSRC ? (
          <img
            src={imageSRC}
            alt="Logo Preview"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        ) : (
          <img
            src={image}
            alt="Logo Preview"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        )}
      </div>
    </div>
  );
};

export default Image;
