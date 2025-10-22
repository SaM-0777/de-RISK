export function parseNFTImage(image: string) {
  if (image.startsWith("ipfs://")) {
    return image.replace(
      "ipfs://",
      `${process.env.NEXT_PUBLIC_PINATA_IPFS_URL}/ipfs/`
    );
  }
  return image;
}

export function parseTokenURI(uri: string) {
  const jsonTokenURI = Buffer.from(
    uri.replace("data:application/json;base64,", ""),
    "base64"
  ).toString("utf-8");

  return JSON.parse(jsonTokenURI);
}
