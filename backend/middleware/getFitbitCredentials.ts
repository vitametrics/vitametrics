import { IDevice } from "../models/Device";
import FitbitAccount from "../models/FitbitAccount";
import { IProject } from "../models/Project";
import User from "../models/User";

async function getFitbitCredentials(device: IDevice, project: IProject) {
    const fitbitAccount = await FitbitAccount.findOne({ userId: device.fitbitUserId, project_id: project._id });
    if (fitbitAccount) {
        return { accessToken: fitbitAccount.accessToken, userId: fitbitAccount.userId };
    }
    const user = await User.findOne({ userId: device.owner, isTempUser: true });
    if (user && user.fitbitAccessToken && user.fitbitUserId) {
        return { accessToken: user.fitbitAccessToken, userId: user.fitbitUserId };
    }
    return { accessToken: null, userId: null};
}

export default getFitbitCredentials;