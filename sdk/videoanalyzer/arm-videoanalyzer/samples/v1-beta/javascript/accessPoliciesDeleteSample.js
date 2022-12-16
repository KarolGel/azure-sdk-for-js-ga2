/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const { VideoAnalyzerManagementClient } = require("@azure/arm-videoanalyzer");
const { DefaultAzureCredential } = require("@azure/identity");
require("dotenv").config();

/**
 * This sample demonstrates how to Deletes an existing access policy resource with the given name.
 *
 * @summary Deletes an existing access policy resource with the given name.
 * x-ms-original-file: specification/videoanalyzer/resource-manager/Microsoft.Media/preview/2021-11-01-preview/examples/access-policy-delete.json
 */
async function deletesAnAccessPolicyEntity() {
  const subscriptionId =
    process.env["VIDEOANALYZER_SUBSCRIPTION_ID"] || "591e76c3-3e97-44db-879c-3e2b12961b62";
  const resourceGroupName = process.env["VIDEOANALYZER_RESOURCE_GROUP"] || "testrg";
  const accountName = "testaccount2";
  const accessPolicyName = "accessPolicyName1";
  const credential = new DefaultAzureCredential();
  const client = new VideoAnalyzerManagementClient(credential, subscriptionId);
  const result = await client.accessPolicies.delete(
    resourceGroupName,
    accountName,
    accessPolicyName
  );
  console.log(result);
}

async function main() {
  deletesAnAccessPolicyEntity();
}

main().catch(console.error);
