// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { DigitalTwinsClient, DigitalTwinsUpdateComponentOptionalParams } from "../../src";
import { authenticate } from "../utils/testAuthentication";
import type { Recorder } from "@azure-tools/test-recorder";
import { isLiveMode } from "@azure-tools/test-recorder";
import chai from "chai";
import { isRestError } from "@azure/core-rest-pipeline";

const assert: typeof chai.assert = chai.assert;
const should = chai.should();

const MODEL_ID = "dtmi:samples:DTComponentTestsModel;1";
const COMPONENT_ID = "dtmi:samples:DTComponentTestsComponent;1";
const DIGITAL_TWIN_ID = "DTComponentTestsTempTwin";

const testComponent = {
  "@id": COMPONENT_ID,
  "@type": "Interface",
  "@context": "dtmi:dtdl:context;2",
  displayName: "Component1",
  contents: [
    {
      "@type": "Property",
      name: "ComponentProp1",
      schema: "string",
    },
    {
      "@type": "Telemetry",
      name: "ComponentTelemetry1",
      schema: "integer",
    },
  ],
};

const testModel = {
  "@id": MODEL_ID,
  "@type": "Interface",
  "@context": "dtmi:dtdl:context;2",
  displayName: "TempModel",
  contents: [
    {
      "@type": "Property",
      name: "Prop1",
      schema: "string",
    },
    {
      "@type": "Component",
      name: "Component1",
      schema: COMPONENT_ID,
    },
    {
      "@type": "Telemetry",
      name: "Telemetry1",
      schema: "integer",
    },
  ],
};

const temporary_twin = {
  $metadata: {
    $model: MODEL_ID,
  },
  Prop1: "value",
  Component1: {
    $metadata: {},
    ComponentProp1: "value1",
  },
};

describe("DigitalTwins Components - read, update and delete operations", () => {
  let client: DigitalTwinsClient;
  let recorder: Recorder;

  beforeEach(async function (this: Mocha.Context) {
    const authentication = await authenticate(this);
    client = authentication.client;
    recorder = authentication.recorder;
  });

  afterEach(async function () {
    await recorder.stop();
  });

  async function deleteModels(): Promise<void> {
    try {
      await client.deleteModel(MODEL_ID);
    } catch (e: any) {
      if (!isRestError(e) || e.statusCode !== 404) {
        console.error("deleteModel failed during test setup or cleanup", e);
        throw e;
      }
    }

    try {
      await client.deleteModel(COMPONENT_ID);
    } catch (e: any) {
      if (!isRestError(e) || e.statusCode !== 404) {
        console.error("deleteModel failed during test setup or cleanup", e);
        throw e;
      }
    }
  }

  async function createModel(): Promise<void> {
    const simpleModels = [testComponent, testModel];
    await client.createModels(simpleModels);
  }

  async function setUpModels(): Promise<void> {
    await deleteModels();
    await createModel();
  }

  async function deleteDigitalTwin(digitalTwinId: string): Promise<void> {
    try {
      await client.deleteDigitalTwin(digitalTwinId);
    } catch (e: any) {
      if (!isRestError(e) || e.statusCode !== 404) {
        console.error("deleteDigitalTwin failure during test setup or cleanup", e);
        throw e;
      }
    }
  }

  async function createDigitalTwin(digitalTwinId: string): Promise<void> {
    await deleteDigitalTwin(digitalTwinId);
    await client.upsertDigitalTwin(digitalTwinId, JSON.stringify(temporary_twin));
  }

  it("get component not existing", async function () {
    await setUpModels();
    await createDigitalTwin(DIGITAL_TWIN_ID);

    let errorWasThrown = false;
    try {
      await client.getComponent(DIGITAL_TWIN_ID, "Component3");
    } catch (error: any) {
      errorWasThrown = true;
      assert.include(error.message, `DTComponentTestsTempTwin does not have component Component3`);
    } finally {
      await deleteDigitalTwin(DIGITAL_TWIN_ID);
      await deleteModels();
    }
    should.equal(errorWasThrown, true, "Error was not thrown");
  });

  it("get component simple", async function () {
    await setUpModels();
    await createDigitalTwin(DIGITAL_TWIN_ID);

    try {
      const component: any = await client.getComponent(DIGITAL_TWIN_ID, "Component1");
      assert.notEqual(component, null);
      assert.notEqual(component.ComponentProp1, null);
      assert.equal(component.ComponentProp1, "value1");
      assert.equal(component.ComponentTelemetry1, null);
    } finally {
      await deleteDigitalTwin(DIGITAL_TWIN_ID);
      await deleteModels();
    }
  });

  it("update component replace", async function () {
    await setUpModels();
    await createDigitalTwin(DIGITAL_TWIN_ID);

    const patch = [
      {
        op: "replace",
        path: "/ComponentProp1",
        value: "value2",
      },
    ];
    try {
      await client.updateComponent(DIGITAL_TWIN_ID, "Component1", patch);
      const component: any = await client.getComponent(DIGITAL_TWIN_ID, "Component1");
      assert.notEqual(component, null);
      assert.notEqual(component.ComponentProp1, null);
      assert.equal(component.ComponentProp1, "value2");
    } finally {
      await deleteDigitalTwin(DIGITAL_TWIN_ID);
      await deleteModels();
    }
  });

  it("update component remove", async function () {
    await setUpModels();
    await createDigitalTwin(DIGITAL_TWIN_ID);

    const patch = [
      {
        op: "remove",
        path: "/ComponentProp1",
      },
    ];
    try {
      await client.updateComponent(DIGITAL_TWIN_ID, "Component1", patch);
      const component: any = await client.getComponent(DIGITAL_TWIN_ID, "Component1");
      assert.notEqual(component, null);
      assert.equal(component.ComponentProp1, null);
    } finally {
      await deleteDigitalTwin(DIGITAL_TWIN_ID);
      await deleteModels();
    }
  });

  it("update component add", async function () {
    await setUpModels();
    await createDigitalTwin(DIGITAL_TWIN_ID);

    const patch = [
      {
        op: "add",
        path: "/ComponentProp1",
        value: "5",
      },
    ];
    try {
      await client.updateComponent(DIGITAL_TWIN_ID, "Component1", patch);
      const component: any = await client.getComponent(DIGITAL_TWIN_ID, "Component1");
      assert.notEqual(component, null);
      assert.notEqual(component.ComponentProp1, null);
      assert.equal(component.ComponentProp1, "5");
    } finally {
      await deleteDigitalTwin(DIGITAL_TWIN_ID);
      await deleteModels();
    }
  });

  it("update component multiple", async function () {
    await setUpModels();
    await createDigitalTwin(DIGITAL_TWIN_ID);

    const patch = [
      {
        op: "replace",
        path: "/ComponentProp1",
        value: "value2",
      },
      {
        op: "remove",
        path: "/ComponentProp1",
      },
    ];
    try {
      await client.updateComponent(DIGITAL_TWIN_ID, "Component1", patch);
      const component: any = await client.getComponent(DIGITAL_TWIN_ID, "Component1");
      assert.exists(component);
      assert.equal(component.ComponentProp1, null);

      const twin: any = await client.getDigitalTwin(DIGITAL_TWIN_ID);
      assert.equal(twin.Component1.ComponentProp1, null);
    } finally {
      await deleteDigitalTwin(DIGITAL_TWIN_ID);
      await deleteModels();
    }
  });

  it("update component invalid patch", async function () {
    await setUpModels();
    await createDigitalTwin(DIGITAL_TWIN_ID);

    const patch = [
      {
        op: "move",
        path: "/AverageTemperature",
        value: 42,
      },
    ];
    let errorWasThrown = false;
    try {
      await client.updateComponent(DIGITAL_TWIN_ID, "Component1", patch);
    } catch (error: any) {
      errorWasThrown = true;
      assert.include(error.message, `Unsupported operation type move`);
    } finally {
      await deleteDigitalTwin(DIGITAL_TWIN_ID);
      await deleteModels();
    }
    should.equal(errorWasThrown, true, "Error was not thrown");
  });

  it("update component conditionally if present", async function () {
    await setUpModels();
    await createDigitalTwin(DIGITAL_TWIN_ID);

    const patch = [
      {
        op: "replace",
        path: "/ComponentProp1",
        value: "value2",
      },
    ];
    try {
      const twin = await client.getDigitalTwin(DIGITAL_TWIN_ID);
      const options: DigitalTwinsUpdateComponentOptionalParams = {
        ifMatch: twin.etag,
      };
      await client.updateComponent(DIGITAL_TWIN_ID, "Component1", patch, options);
      const component: any = await client.getComponent(DIGITAL_TWIN_ID, "Component1");
      assert.notEqual(component, null);
      assert.notEqual(component.ComponentProp1, null);
      assert.equal(component.ComponentProp1, "value2");
    } finally {
      await deleteDigitalTwin(DIGITAL_TWIN_ID);
      await deleteModels();
    }
  });

  it("update component invalid conditions", async function () {
    await setUpModels();
    await createDigitalTwin(DIGITAL_TWIN_ID);

    const patch = [
      {
        op: "replace",
        path: "/ComponentProp1",
        value: "value2",
      },
    ];
    const options: DigitalTwinsUpdateComponentOptionalParams = {
      ifMatch: "etag-value",
    };
    let errorWasThrown = false;
    try {
      await client.updateComponent(DIGITAL_TWIN_ID, "Component1", patch, options);
    } catch (error: any) {
      errorWasThrown = true;
      assert.include(error.message, `Invalid If-Match header value`);
    } finally {
      await deleteDigitalTwin(DIGITAL_TWIN_ID);
      await deleteModels();
    }
    should.equal(errorWasThrown, true, "Error was not thrown");
  });

  // TODO: Fix the test. Tracking issue: https://github.com/Azure/azure-sdk-for-js/issues/30395
  it.skip("update component not existing", async function () {
    await setUpModels();
    await createDigitalTwin(DIGITAL_TWIN_ID);

    const patch = [
      {
        op: "replace",
        path: "/ComponentProp1",
        value: "value2",
      },
    ];
    let errorWasThrown = false;
    try {
      await client.updateComponent(DIGITAL_TWIN_ID, "Component2", patch);
    } catch (error: any) {
      errorWasThrown = true;
      assert.include(error.message, `Could not resolve path`);
    } finally {
      await deleteDigitalTwin(DIGITAL_TWIN_ID);
      await deleteModels();
    }
    should.equal(errorWasThrown, true, "Error was not thrown");
  });

  it("publish component telemetry", async function () {
    if (!isLiveMode()) {
      this.skip();
    }
    await setUpModels();
    await createDigitalTwin(DIGITAL_TWIN_ID);

    try {
      const telemetry = { ComponentTelemetry1: 1 };
      const test_messageId = "test_message1";
      await client.publishComponentTelemetry(
        DIGITAL_TWIN_ID,
        "Component1",
        telemetry,
        test_messageId,
      );
    } finally {
      await deleteDigitalTwin(DIGITAL_TWIN_ID);
      await deleteModels();
    }
  });

  it("publish component telemetry with message id", async function () {
    if (!isLiveMode()) {
      this.skip();
    }
    await setUpModels();
    await createDigitalTwin(DIGITAL_TWIN_ID);

    try {
      const telemetry = { ComponentTelemetry2: 2 };
      const test_messageId = "test_message2";
      await client.publishComponentTelemetry(
        DIGITAL_TWIN_ID,
        "Component1",
        telemetry,
        test_messageId,
      );
    } finally {
      await deleteDigitalTwin(DIGITAL_TWIN_ID);
      await deleteModels();
    }
  });

  it("publish component telemetry not existing", async function () {
    if (!isLiveMode()) {
      this.skip();
    }
    await setUpModels();
    await createDigitalTwin(DIGITAL_TWIN_ID);

    const telemetry = { ComponentTelemetry3: 3 };
    const test_messageId = "test_message3";
    let errorWasThrown = false;
    try {
      await client.publishComponentTelemetry(
        DIGITAL_TWIN_ID,
        "Component2",
        telemetry,
        test_messageId,
      );
    } catch (error: any) {
      errorWasThrown = true;
      assert.include(error.message, `DTComponentTestsTempTwin does not have component Component2`);
    } finally {
      await deleteDigitalTwin(DIGITAL_TWIN_ID);
      await deleteModels();
    }
    should.equal(errorWasThrown, true, "Error was not thrown");
  });
});
