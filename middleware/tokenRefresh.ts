// import User from '../models/User';
// import refreshToken from '../util/refreshToken';

// async function tokenRefresh(userId: string) {
//     const user = await User.findOne({userId});

//     if (user) {
//         try {
//             const newAccessToken = await refreshToken(userId);
//             return newAccessToken;
//         } catch (err) {
//             console.error("Error refreshing access token: ", err);
//             throw err;
//         }
//     } else {
//         throw new Error("User not found");
//     }
// }