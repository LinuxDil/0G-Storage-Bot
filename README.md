# 0G Storage Auto Bot

Automated bot for interacting with the 0G Storage Network to help maximize airdrop potential.

## Overview

This tool automates the process of uploading random files to the 0G Storage Network on Galileo Testnet. It helps users participate in testnet activities which may lead to potential future airdrops.

## Support

For questions or support, open an issue on GitHub or join our community:
- [Telegram](https://t.me/AirdropSeeker_Official)

## Features

- **Multi-Wallet Support**: Run tasks across multiple private keys sequentially
- **Proxy Integration**: Use rotating proxies to prevent rate limiting
- **User-Agent Rotation**: Automatic rotating of user agents for each request
- **Detailed Statistics**: Track successful and failed operations
- **Transaction History**: Save all transaction details for future reference

## Installation

Clone the repository
```bash
git clone https://github.com/LinuxDil/0g-Storage-Bot.git
cd 0g-Storage-Bot
```
Install dependencies
```bash
npm install
```

## Configuration

1. Create a `.env` file in the root directory with your private keys:

```
# For a single wallet
PRIVATE_KEY=your_private_key_here

# OR for multiple wallets
PRIVATE_KEY_1=your_first_private_key
PRIVATE_KEY_2=your_second_private_key
PRIVATE_KEY_3=your_third_private_key
```

2. (Optional) Create a `proxies.txt` file with one proxy per line:

```
http://username:password@ip:port
http://ip:port
socks5://username:password@ip:port
```

## Usage

Run the bot with:

```bash
node index.js
```

When prompted, enter the number of files you want to upload per wallet.

## How It Works

1. The bot loads your private keys and proxies
2. For each wallet:
   - It fetches random images
   - Calculates hash and prepares data
   - Uploads the file segments to the 0G indexer
   - Submits a blockchain transaction to register the upload
   - Waits for confirmation before proceeding to the next upload
3. Results are saved to the `results` directory

## Troubleshooting

- **Gas Errors**: Make sure your wallets have sufficient 0G testnet tokens
- **Network Issues**: Check your internet connection or try using proxies
- **RPC Errors**: The testnet RPC might be under load, try again later

## Disclaimer

This tool is for educational and testnet participation purposes only. Using this bot does not guarantee eligibility for any future airdrops. Always use testnet tools responsibly.

## License

MIT
Thanks bg Viki
