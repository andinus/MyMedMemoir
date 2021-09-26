import smartpy as sp

class Memoir(sp.Contract):
    def __init__(self):
        self.init(
            dates = sp.list([]),
            records = sp.list([])
        )

    @sp.entry_point
    def add_record(self, params):
        self.data.dates.push(sp.now)
        self.data.records.push(params.record)
        # self.data.records[params.id] = params.record
        # Verify that the ID doesn't exist.
        # sp.verify(
        #     self.data.records.contains(params.id) == False,
        #     message = "Record exists"
        # )

    # @sp.entry_point
    # def update_record(self, params):
    #     self.data.records = sp.update_map(
    #         self.data.records,
    #         params.id,
    #         sp.some(params.record)
    #     )

    @sp.entry_point
    def delete_record(self, params):
        del self.data.records[params.id]

@sp.add_test(name="MyMedMemoir")
def test():
    scenario = sp.test_scenario()
    scenario.h1("MyMedMemoir")

    c1 = Memoir()
    scenario += c1

    # Try adding records.
    # scenario += c1.add_record(id = 0, record = '{record #0}')
    # scenario += c1.add_record(id = 1, record = '{record #1}')
    # scenario += c1.add_record(id = 2, record = '{record #2}')
    scenario += c1.add_record(record = '{record #1}')
    scenario += c1.add_record(record = '{record #2}')

    # Updating records.
    # scenario += c1.update_record(id = 1, record = '{record #1 - updated}')

    # Deleting records.
    # scenario += c1.delete_record(id = 2)
    scenario += c1.delete_record(id = 2)

    # Trying to add over existing record. Should Fail.
    # scenario += c1.add_record(
    #     id = 2, record = '{record #2 - fail}'
    # ).run(valid = False)
