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

@sp.add_test(name="MyMedMemoir")
def test():
    scenario = sp.test_scenario()
    scenario.h1("MyMedMemoir")

    c1 = Memoir()
    scenario += c1

    # Try adding records.
    scenario += c1.add_record(record = '{record #1}')
    scenario += c1.add_record(record = '{record #2}')