import Pagination from "../../Pagination";
import usePagination from "../../../hooks/usePagination";
import PaginationControls from "../../../components/Dashboard/PaginationControls";
import useSearch from "../../../hooks/useAdminAccountSearch";
import { Fragment } from "react";
import AccountsList from "./AdminAccountsList";
import { useAuth } from "../../../helpers/AuthContext";
import { useEffect } from "react";

const AccountsContainer = () => {
  const { siteAccounts, fetchSiteAccounts } = useAuth();

  /*
  const testAccounts = [
    {
      userId: "BXVFHB",
      accessToken:
        "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1JNRFciLCJzdWIiOiJCWFZGSEIiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJzZXQgcm94eSBybnV0IHJwcm8gcnNsZSByYWN0IHJsb2MgcnJlcyByd2VpIHJociBydGVtIiwiZXhwIjoxNzIxNDYxMjY2LCJpYXQiOjE3MjE0MzI0NjZ9.cydof0KdDs-2HLQYG-4U1PX2yHzkmm_umkDNkuvYMNI",
      refreshToken:
        "2367f9f83b62364b04ce47a5fa797603a8f042dceb419dd80bd89b8001183914",
      lastTokenRefresh: "2024-07-19T23:41:06.349Z",
      projects: [
        {
          projectId: "530d943c58bfc345089e9520ea27cba5",
          projectName: "Test Project 1",
          devices: [
            {
              _id: "669af9969fba6edb69dea345",
              projectId: "530d943c58bfc345089e9520ea27cba5",
              deviceName: "Alta HR",
              deviceVersion: "Alta HR",
              batteryLevel: "14",
              deviceId: "2668136044",
              lastSyncTime: "2024-07-19T16:33:46.000",
            },
          ],
        },
      ],
    },
    {
      userId: "BXVFHB",
      accessToken:
        "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1JNRFciLCJzdWIiOiJCWFZGSEIiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJzZXQgcm94eSBycHJvIHJudXQgcnNsZSByYWN0IHJsb2MgcnJlcyByd2VpIHJociBydGVtIiwiZXhwIjoxNzIxNDYyMDgzLCJpYXQiOjE3MjE0MzMyODN9.q0igzplnTJQdjUmZ-erwQHhNMEyFkehMKWaZQSY8jfQ",
      refreshToken:
        "37b04b05f090a2ae3f315517f8df1c698a946a20cbaf15a490e382f6caafacec",
      lastTokenRefresh: "2024-07-19T23:54:43.626Z",
      projects: [
        {
          projectId: "376b54f8621786ee4ea0c4ae86e098ff",
          projectName: "Test Project 2",
          devices: [
            {
              _id: "669afcc94210e68958b1b585",
              projectId: "376b54f8621786ee4ea0c4ae86e098ff",
              deviceName: "Alta HR",
              deviceVersion: "Alta HR",
              batteryLevel: "14",
              deviceId: "2668136044",
              lastSyncTime: "2024-07-19T16:49:01.000",
            },
          ],
        },
      ],
    },
    {
      userId: "C5FFQ2",
      accessToken:
        "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1JNRFciLCJzdWIiOiJDNUZGUTIiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJzZXQgcm94eSBybnV0IHJwcm8gcnNsZSByYWN0IHJyZXMgcmxvYyByd2VpIHJociBydGVtIiwiZXhwIjoxNzIxNDYyMTg5LCJpYXQiOjE3MjE0MzMzODl9.wkSq7zg-isC9ZYrJQ-7JDNdXLDgWKqj9tu4SRJKiOwY",
      refreshToken:
        "7cb10350d7ed912b7616b3545a860cc2f00db188b4b34b85a30b9d7c35cfb669",
      lastTokenRefresh: "2024-07-19T23:56:29.744Z",
      projects: [
        {
          projectId: "376b54f8621786ee4ea0c4ae86e098ff",
          projectName: "Test Project 2",
          devices: [
            {
              _id: "669afd304210e68958b1b644",
              projectId: "376b54f8621786ee4ea0c4ae86e098ff",
              deviceName: "Alta HR",
              deviceVersion: "Alta HR",
              batteryLevel: "80",
              deviceId: "2659969786",
              lastSyncTime: "2024-07-19T16:54:37.000",
            },
          ],
        },
      ],
    },
  ];*/

  const itemsPerPageOptions = [5, 10, 15, 20];
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    handleItemsPerPageChange,
  } = usePagination();

  useEffect(() => {
    if (siteAccounts.length === 0) fetchSiteAccounts();
  }, []);

  const { searchTerm, handleSearchChange, filteredItems } = useSearch(
    siteAccounts,
    setCurrentPage
  );

  const indexOfLastAccount = Math.min(
    currentPage * itemsPerPage,
    Object.keys(filteredItems)?.length
  );
  const indexOfFirstAccount = (currentPage - 1) * itemsPerPage;
  const currentAccounts = filteredItems?.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-10 mb-12 border-2 border-gray-300">
      <h2 className="text-2xl text-primary font-bold mb-3">
        Your Instance's Fitbit Accounts
      </h2>
      {siteAccounts && siteAccounts.length === 0 ? (
        <span className="text-primary text-lg">No accounts found</span>
      ) : (
        <Fragment>
          <div className="flex flex-row text-primary items-center mb-3"></div>
          <input
            type="text"
            placeholder="Search For Name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 w-[300px] mr-auto border-2 border-gray-200 rounded-lg mb-2"
          />
          <PaginationControls
            itemsPerPage={itemsPerPage}
            handleItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPageOptions={itemsPerPageOptions}
            totalItems={filteredItems?.length || 0}
            currentPage={currentPage}
            indexOfLastItem={indexOfLastAccount}
          />
          <AccountsList
            accounts={currentAccounts}
            refreshFitbitAccounts={fetchSiteAccounts}
          />
          {currentAccounts?.length !== 0 && (
            <span className="h-[0.5px] bg-[#d3d7df] w-full mb-3"></span>
          )}

          <div
            id="pagination"
            className="flex flex-row mt-auto ml-auto items-center"
          >
            <Pagination
              totalItems={filteredItems?.length || 0}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default AccountsContainer;
