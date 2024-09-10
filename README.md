# Getting Started

## Usage

1. Fork this repository.
2. Sign up for [Alchemy](https://www.alchemy.com/) and [Ark Project](https://www.arkproject.dev/). Obtain your API keys.
3. Create a `.env.local` file and populate it with the environment variables as specified in the `.env.example` file.

### installation

```bash
npm install
#or
yarn
#or
pnpm install
```

### Run development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Environment variables

We use Ark Project for indexing NFT information and Alchemy for blockchain interactions. Ensure you have accounts with both platforms and input your API keys in the `.env.local` file.

## Getting your NFT artwork to show up in the iFrame

- NFT Route: The contract address and token ID are extracted from the URL parameters `/contractAddress/tokenId`. The `fetchNFTData` function in `app/hooks/index.ts` fetches the NFT data, and the Token Bound Account (TBA) associated with the token ID (used as the salt) is returned.

- TBA Route: The contract address of the TBA is retrieved from the URL parameters `/tokenboundAddress`. The getOwnerNFT function in `app/utils/index.ts` retrieves the owner NFT’s contract address and token ID. The NFT data is then fetched using the fetchNFTData function, also located in `app/utils/index.ts`.

## Learn More

To learn more about Tokenbound, take a look at the following resources:

- [Starknet Tokenbound Documentation](https://docs.tbaexplorer.com/)
