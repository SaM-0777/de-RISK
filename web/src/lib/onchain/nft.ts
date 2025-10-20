const PINATA_JWT = process.env.PINATA_JWT;

export async function uploadMetadata(
  policyName: string,
  metadata: {
    name: string;
    description: string;
    image: string; // ipfs cid of image
  }
) {
  const json = JSON.stringify(metadata);
  const blob = new Blob([json]);
  const file = new File([blob], `${policyName}.json`, {
    type: "application/json",
  });

  const formData = new FormData();
  formData.append("file", file);

  try {
    const request = await fetch(`https://api.pinata.cloud/pinning/pinFileToIPFS`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: formData,
    });

    const response = await request.json();
    console.log({ response });
    return response;
  } catch (error) {
    console.error(`src.lib.onchain.nft.uploadMetadata.error ${error}`);
    return null;
  }
}

uploadMetadata("DePeg Insurance", {
  name: "DePeg Insurance",
  description: "Insurance against Depeg",
  image: "https://gateway.pinata.cloud/ipfs/QmfLAUgFWLkkfS5CJRULbmp7TH3ik2yucEkzFc1EMfkNKi",
})
  .then(() => process.exit(0)) // QmfJhZjXqG9nhrheQkW79NDffyvxNkrUAkRq2ukSLYHATr
  .catch((e) => {
    process.exit(1);
  });
