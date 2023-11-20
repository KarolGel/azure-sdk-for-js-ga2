/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import * as coreClient from "@azure/core-client";
import * as coreRestPipeline from "@azure/core-rest-pipeline";
import {
  PipelineRequest,
  PipelineResponse,
  SendRequest
} from "@azure/core-rest-pipeline";
import * as coreAuth from "@azure/core-auth";
import {
  OperationsImpl,
  ManagedClustersImpl,
  MaintenanceConfigurationsImpl,
  AgentPoolsImpl,
  MachinesImpl,
  PrivateEndpointConnectionsImpl,
  PrivateLinkResourcesImpl,
  ResolvePrivateLinkServiceIdImpl,
  SnapshotsImpl,
  ManagedClusterSnapshotsImpl,
  TrustedAccessRolesImpl,
  TrustedAccessRoleBindingsImpl
} from "./operations";
import {
  Operations,
  ManagedClusters,
  MaintenanceConfigurations,
  AgentPools,
  Machines,
  PrivateEndpointConnections,
  PrivateLinkResources,
  ResolvePrivateLinkServiceId,
  Snapshots,
  ManagedClusterSnapshots,
  TrustedAccessRoles,
  TrustedAccessRoleBindings
} from "./operationsInterfaces";
import { ContainerServiceClientOptionalParams } from "./models";

export class ContainerServiceClient extends coreClient.ServiceClient {
  $host: string;
  apiVersion: string;
  subscriptionId: string;

  /**
   * Initializes a new instance of the ContainerServiceClient class.
   * @param credentials Subscription credentials which uniquely identify client subscription.
   * @param subscriptionId The ID of the target subscription. The value must be an UUID.
   * @param options The parameter options
   */
  constructor(
    credentials: coreAuth.TokenCredential,
    subscriptionId: string,
    options?: ContainerServiceClientOptionalParams
  ) {
    if (credentials === undefined) {
      throw new Error("'credentials' cannot be null");
    }
    if (subscriptionId === undefined) {
      throw new Error("'subscriptionId' cannot be null");
    }

    // Initializing default values for options
    if (!options) {
      options = {};
    }
    const defaults: ContainerServiceClientOptionalParams = {
      requestContentType: "application/json; charset=utf-8",
      credential: credentials
    };

    const packageDetails = `azsdk-js-arm-containerservice/19.5.0-beta.1`;
    const userAgentPrefix =
      options.userAgentOptions && options.userAgentOptions.userAgentPrefix
        ? `${options.userAgentOptions.userAgentPrefix} ${packageDetails}`
        : `${packageDetails}`;

    const optionsWithDefaults = {
      ...defaults,
      ...options,
      userAgentOptions: {
        userAgentPrefix
      },
      endpoint:
        options.endpoint ?? options.baseUri ?? "https://management.azure.com"
    };
    super(optionsWithDefaults);

    let bearerTokenAuthenticationPolicyFound: boolean = false;
    if (options?.pipeline && options.pipeline.getOrderedPolicies().length > 0) {
      const pipelinePolicies: coreRestPipeline.PipelinePolicy[] = options.pipeline.getOrderedPolicies();
      bearerTokenAuthenticationPolicyFound = pipelinePolicies.some(
        (pipelinePolicy) =>
          pipelinePolicy.name ===
          coreRestPipeline.bearerTokenAuthenticationPolicyName
      );
    }
    if (
      !options ||
      !options.pipeline ||
      options.pipeline.getOrderedPolicies().length == 0 ||
      !bearerTokenAuthenticationPolicyFound
    ) {
      this.pipeline.removePolicy({
        name: coreRestPipeline.bearerTokenAuthenticationPolicyName
      });
      this.pipeline.addPolicy(
        coreRestPipeline.bearerTokenAuthenticationPolicy({
          credential: credentials,
          scopes:
            optionsWithDefaults.credentialScopes ??
            `${optionsWithDefaults.endpoint}/.default`,
          challengeCallbacks: {
            authorizeRequestOnChallenge:
              coreClient.authorizeRequestOnClaimChallenge
          }
        })
      );
    }
    // Parameter assignments
    this.subscriptionId = subscriptionId;

    // Assigning values to Constant parameters
    this.$host = options.$host || "https://management.azure.com";
    this.apiVersion = options.apiVersion || "2023-09-02-preview";
    this.operations = new OperationsImpl(this);
    this.managedClusters = new ManagedClustersImpl(this);
    this.maintenanceConfigurations = new MaintenanceConfigurationsImpl(this);
    this.agentPools = new AgentPoolsImpl(this);
    this.machines = new MachinesImpl(this);
    this.privateEndpointConnections = new PrivateEndpointConnectionsImpl(this);
    this.privateLinkResources = new PrivateLinkResourcesImpl(this);
    this.resolvePrivateLinkServiceId = new ResolvePrivateLinkServiceIdImpl(
      this
    );
    this.snapshots = new SnapshotsImpl(this);
    this.managedClusterSnapshots = new ManagedClusterSnapshotsImpl(this);
    this.trustedAccessRoles = new TrustedAccessRolesImpl(this);
    this.trustedAccessRoleBindings = new TrustedAccessRoleBindingsImpl(this);
    this.addCustomApiVersionPolicy(options.apiVersion);
  }

  /** A function that adds a policy that sets the api-version (or equivalent) to reflect the library version. */
  private addCustomApiVersionPolicy(apiVersion?: string) {
    if (!apiVersion) {
      return;
    }
    const apiVersionPolicy = {
      name: "CustomApiVersionPolicy",
      async sendRequest(
        request: PipelineRequest,
        next: SendRequest
      ): Promise<PipelineResponse> {
        const param = request.url.split("?");
        if (param.length > 1) {
          const newParams = param[1].split("&").map((item) => {
            if (item.indexOf("api-version") > -1) {
              return "api-version=" + apiVersion;
            } else {
              return item;
            }
          });
          request.url = param[0] + "?" + newParams.join("&");
        }
        return next(request);
      }
    };
    this.pipeline.addPolicy(apiVersionPolicy);
  }

  operations: Operations;
  managedClusters: ManagedClusters;
  maintenanceConfigurations: MaintenanceConfigurations;
  agentPools: AgentPools;
  machines: Machines;
  privateEndpointConnections: PrivateEndpointConnections;
  privateLinkResources: PrivateLinkResources;
  resolvePrivateLinkServiceId: ResolvePrivateLinkServiceId;
  snapshots: Snapshots;
  managedClusterSnapshots: ManagedClusterSnapshots;
  trustedAccessRoles: TrustedAccessRoles;
  trustedAccessRoleBindings: TrustedAccessRoleBindings;
}
