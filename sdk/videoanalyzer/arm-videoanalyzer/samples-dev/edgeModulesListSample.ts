/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { VideoAnalyzerManagementClient } from "@azure/arm-videoanalyzer";
import { DefaultAzureCredential } from "@azure/identity";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * This sample demonstrates how to List all existing edge module resources, along with their JSON representations.
 *
 * @summary List all existing edge module resources, along with their JSON representations.
 * x-ms-original-file: specification/videoanalyzer/resource-manager/Microsoft.Media/preview/2021-11-01-preview/examples/edge-modules-list.json
 */
async function listsTheRegisteredEdgeModules() {
  const subscriptionId =
    process.env["VIDEOANALYZER_SUBSCRIPTION_ID"] ||
    "591e76c3-3e97-44db-879c-3e2b12961b62";
  const resourceGroupName =
    process.env["VIDEOANALYZER_RESOURCE_GROUP"] || "testrg";
  const accountName = "testaccount2";
  const credential = new DefaultAzureCredential();
  const client = new VideoAnalyzerManagementClient(credential, subscriptionId);
  const resArray = new Array();
  for await (let item of client.edgeModules.list(
    resourceGroupName,
    accountName
  )) {
    resArray.push(item);
  }
  console.log(resArray);
}

async function main() {
  listsTheRegisteredEdgeModules();
}

main().catch(console.error);
