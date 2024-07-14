import axios from "axios";


export const fetchFitbitAccounts = async (projectId: string) => {
    try{
     const res = await axios.get(`${process.env.API_URL}/project/fitbit-accounts`, {
        params: {
          projectId: projectId,
        },
        withCredentials: true,
      });
      console.log("from fitbit service:")
      console.log(res.data);
    return res.data;
    } catch (error) {
        console.error("Error fetching fitbit accounts:", error);
    }
}


export const deleteFitbitAccount = async (projectId: string, accountId: string) => {
    try{
        const res = await axios.delete(`${process.env.API_URL}/project/fit-bit-accounts`, {
            params: {
              projectId: projectId,
              accountId: accountId,
            },
            withCredentials: true,
          });
        return res.data;
    } catch (error) {
        console.error("Error deleting fitbit account:", error);
    }
}

export const addFitbitAccount = async (projectId: string, code: string) => {
    try{
        const res = await axios.post(`${process.env.API_URL}/project/add-fitbit-accounts`, {
            projectId: projectId,
            code: code,
          },
          {
            withCredentials: true,
          });
        return res.data;
    } catch (error) {
        console.error("Error adding fitbit account:", error);
    }
}


export const unlinkFitbitAccount = async (accountId: string) => {
    try{
         await axios.post(`${process.env.API_URL}/project/unlink-fitbit-account`, {
              fitbitUserId: accountId, 
          }, {withCredentials: true,
          });
        
    } catch (error) {
        console.error("Error unlinking fitbit account:", error);
    }
}




