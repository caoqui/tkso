const Push = require("pushover-notifications");
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const fs = require("fs");
const pushover = new Push({
    token: "az7vqqic84dsqxmm7mhyvqjoycrn3c", // Thay bằng API Token của bạn
    user: "u8dfzijeho9j5eepxszdifvmy3v4e8", // Thay bằng User Key của bạn
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
        '$BAM Holder Quest'
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
            for (let i=0; i<20; i++) {
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
