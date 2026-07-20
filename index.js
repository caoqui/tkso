const Push = require("pushover-notifications");
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const fs = require("fs");
const pushover = new Push({
    token: "awmgiede9j2guqawgb4rv47mxh5a96", // Thay bằng API Token của bạn
    user: "ua2josy8s8w3mcd2msq8w9p1b1iqt2", // Thay bằng User Key của bạn
});

function sendNotification(message) {
    const msg = {
        message: message,
        title: "THÔNG BÁO TỪ CHECK Taskon",
        sound: "echo",
        priority: 1,
    };

    pushover.send(msg, function (err, result) {
        if (err) {
            console.error("Gửi thông báo thất bại:", err);
        } else {
            console.log("Thông báo đã gửi:", result);
        }
    });
}

async function QuestOnchain(url) {
    const listNameQuest = [
        'Onchain Playground(R3): Stake $10 at WStaking',
        '$600,000 GIVEAWAY - JOIN NOW!',
        '$BAM Holder Quest',
        ' Onchain Playground(R3): Stake $IRWA at IncomRWA',
        'Stake $12, earn $3.5 + 35% pool APR — 296% combined APY',
        'Pizza day Stake and Airdrop',
        'Stake $13, earn $4.5 + 35% pool APR — 330% combined APY',
        'Mini Stake Airdrop',
        'Round 2 - $600,000 GIVEAWAY - JOIN NOW!',
        'Stake $12, earn $2.4 + 50% pool APR — 594% combined APR',
        'BSC BEACON TEMPLAR',
        'Round 3 - $1,200,000 GIVEAWAY - JOIN NOW!',
        '📈 StreakUP Predict \u0026 Win: Make Your First Prediction to Share 100 USDT!',
        '🚀 SuperFirulai Community Challenge',
        'Sprint 13 – Trade $BTX On-Chain and Earn',
        'Neosoul BSC March'
    ];
    try {
        const res = await axios.post(url, {
            "page": {
                "page_no": 0,
                "size": 40
            },
            "options": {
                "name_like": "",
                "campaign_status": "OnGoing",
                "user_campaign_status": "All",
                "reward_type": [
                    "All"
                ],
                "network": [],
                "project_category": [
                    "All"
                ],
                "campaign_type": "Campaign",
                "order_by": "Comprehensive",
                "include_private": false,
                "end_day": 0,
                "contain_task_type": [
                    "WithOnChainTask"
                ],
                "is_global_search": false,
                "social_campaign": false,
                "end_tab_sort": false
            }
        });
        const listQuest = res.data.result.data;
        for (const quest of listQuest) {
            if (!listNameQuest.includes(quest.name)) {
                sendNotification("New Quest Onchain.");
                return true;
            }
        }
        return false;
      } catch (err) {
        console.error('Error:', err.message);
      }
};


const app = express();
const port = 3000;

app.get('/', async (req, res) => {

    return res.send("Starting");
});

app.get('/check', async (req, res) => {
    try {
        let statusReturn = await QuestOnchain("https://api.taskon.xyz/v1/getCampaignList");
        if (statusReturn) {
            for (let i=0; i<10; i++) {
                sendNotification("+++++LAM VIEC THOI+++++.");
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
            console.log("RUNING...")
        }


    } catch (error) {
        sendNotification("----ERROR CALLING----")
        console.log(error)
    }

    return res.send("Called successfully!");
});

app.get('/test', async (req, res) => {
    sendNotification("Test.")

    return res.send("Test");
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
