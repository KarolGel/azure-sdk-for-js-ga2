/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  LivePipelineUpdate,
  VideoAnalyzerManagementClient
} from "@azure/arm-videoanalyzer";
import { DefaultAzureCredential } from "@azure/identity";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * This sample demonstrates how to Updates an existing live pipeline with the given name. Properties that can be updated include: description, bitrateKbps, and parameter definitions. Only the description can be updated while the live pipeline is active.
 *
 * @summary Updates an existing live pipeline with the given name. Properties that can be updated include: description, bitrateKbps, and parameter definitions. Only the description can be updated while the live pipeline is active.
 * x-ms-original-file: specification/videoanalyzer/resource-manager/Microsoft.Media/preview/2021-11-01-preview/examples/live-pipeline-patch.json
 */
async function updatesALivePipeline() {
  const subscriptionId =
    process.env["VIDEOANALYZER_SUBSCRIPTION_ID"] ||
    "591e76c3-3e97-44db-879c-3e2b12961b62";
  const resourceGroupName =
    process.env["VIDEOANALYZER_RESOURCE_GROUP"] || "testrg";
  const accountName = "testaccount2";
  const livePipelineName = "livePipeline1";
  const parameters: LivePipelineUpdate = {
    description: "Live Pipeline 1 Description"
  };
  const credential = new DefaultAzureCredential();
  const client = new VideoAnalyzerManagementClient(credential, subscriptionId);
  const result = await client.livePipelines.update(
    resourceGroupName,
    accountName,
    livePipelineName,
    parameters
  );
  console.log(result);
}

async function main() {
  updatesALivePipeline();
}

main().catch(console.error);
