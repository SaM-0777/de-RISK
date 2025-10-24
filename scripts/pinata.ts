import fs from "fs";

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_API_SECRET;
const PINATA_JWT = process.env.PINATA_JWT;

const IMAGEIPFS = {
  image: "usdceth.png",
  cid: "QmfLAUgFWLkkfS5CJRULbmp7TH3ik2yucEkzFc1EMfkNKi",
}

async function uploadNFTImage() {
  const formData = new FormData();
  const fileData = await Bun.file("./nft/USDCETH.png").arrayBuffer();
  formData.append(
    "file",
    new Blob([fileData], { type: "image/png" }),
    "usdceth.png"
  );

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });

  const data = (await res.json()) as any;
  console.log("IPFS CID:", JSON.stringify(data));
}

uploadNFTImage()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
