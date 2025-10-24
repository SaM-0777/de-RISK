import assert from "assert";
import { 
  TestHelpers,
  InsuranceFactory_PolicyCreated
} from "generated";
const { MockDb, InsuranceFactory } = TestHelpers;

describe("InsuranceFactory contract PolicyCreated event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for InsuranceFactory contract PolicyCreated event
  const event = InsuranceFactory.PolicyCreated.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("InsuranceFactory_PolicyCreated is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await InsuranceFactory.PolicyCreated.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualInsuranceFactoryPolicyCreated = mockDbUpdated.entities.InsuranceFactory_PolicyCreated.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedInsuranceFactoryPolicyCreated: InsuranceFactory_PolicyCreated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      policyId: event.params.policyId,
      policyContract: event.params.policyContract,
      name: event.params.name,
      slug: event.params.slug,
      imageUrl: event.params.imageUrl,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualInsuranceFactoryPolicyCreated, expectedInsuranceFactoryPolicyCreated, "Actual InsuranceFactoryPolicyCreated should be the same as the expectedInsuranceFactoryPolicyCreated");
  });
});
