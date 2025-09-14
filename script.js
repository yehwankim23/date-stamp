new FontFace("DS-Digital", "url(font.ttf)").load().then((font) => {
  document.fonts.add(font);
});

const dateInput = document.querySelector("#date");

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
dateInput.value = today.toISOString().slice(0, 10);

const imageInput = document.querySelector("#image");
let inputChanged = false;

[dateInput, imageInput].forEach((input) => {
  input.addEventListener("change", () => {
    inputChanged = true;
  });
});

document.querySelector("form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const files = imageInput.files;

  if (files.length === 0) {
    alert("사진을 선택하세요");
    return;
  }

  if (!inputChanged) {
    return;
  }

  inputChanged = false;

  const result = document.querySelector("#result");
  result.src = "images/loading.gif";

  const image = new Image();
  image.src = URL.createObjectURL(files[0]);
  let imageLoaded = false;

  image.addEventListener("load", () => {
    imageLoaded = true;
  });

  while (!imageLoaded) {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }

  const canvas = document.createElement("canvas");
  const width = image.width;
  const height = image.height;
  const isPortrait = width < height;
  const maxLength = 4032;
  canvas.width = isPortrait ? (maxLength * width) / height : maxLength;
  canvas.height = isPortrait ? maxLength : (maxLength * height) / width;

  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const minLength = isPortrait ? canvas.width : canvas.height;
  const fontSize = minLength / 20;
  context.font = `${minLength / 20}px DS-Digital`;
  context.textAlign = "right";

  context.fillStyle = "rgba(250, 200, 100, 0.5)";
  context.shadowColor = "rgb(200, 100, 100)";
  context.shadowBlur = minLength / 100;

  const date = dateInput.value;
  const offset = fontSize * 1.5;

  context.fillText(
    `'${date.slice(2, 4)}  ${date.slice(5, 7)}  ${date.slice(8, 10)}`,
    canvas.width - offset,
    canvas.height - offset
  );

  result.src = canvas.toDataURL("image/png");
});
