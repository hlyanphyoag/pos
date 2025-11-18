import { useTransaction } from '@/hooks/useTransaction'
import { Button } from '../ui/button'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const AddTransactionRule = ({setOpen} : {setOpen: (value: boolean) => void}) => {
  const {
    formData,
    updateField,
    addRuleFormError,
    rateMutateLoading,
    ClosureOfHandleSubmit,
    // setAddRuleTransactionOpen: setOpen,
  } = useTransaction()


  const {handleTransactionFormSubmit : handleSubmit} = ClosureOfHandleSubmit(setOpen)
  
  return (
    <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Requirement</DialogTitle>
            <DialogDescription>
              Fill in the details for your requirement configuration.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Enter requirement name"
              />
              {addRuleFormError.name && <div className="text-sm text-red-600">{addRuleFormError.name}</div>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="operator">Operator</Label>
                <Select value={formData.operator} onValueChange={(val) => updateField('operator', val)}>
                  <SelectTrigger id="operator">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="GT">Greater Than (GT)</SelectItem>
                    <SelectItem value="LT">Less Than (LT)</SelectItem>
                    <SelectItem value="EQ">Equal (EQ)</SelectItem> */}
                    <SelectItem value="GTE">Over</SelectItem>
                    <SelectItem value="LT">Under</SelectItem>
                    <SelectItem value="BT">Between</SelectItem>
                  </SelectContent>
                </Select>
                {addRuleFormError.operator && <div className="text-sm text-red-600">{addRuleFormError.operator}</div>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => updateField('value', e.target.value && parseFloat(e.target.value))}
                />
                {addRuleFormError.value && <div className="text-sm text-red-600">{addRuleFormError.value}</div>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="secondValue">Second Value</Label>
                <Input
                  id="secondValue"
                  type="number"
                  value={formData.secondValue}
                  onChange={(e) => updateField('secondValue', e.target.value && parseFloat(e.target.value))}
                />
                {addRuleFormError.secondValue && <div className="text-sm text-red-600">{addRuleFormError.secondValue}</div>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="percentage">Percentage</Label>
                <Input
                  id="percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.percentage}
                  onChange={(e) => updateField('percentage', e.target.value && parseFloat(e.target.value))}
                />
                {addRuleFormError.percentage && <div className="text-sm text-red-600">{addRuleFormError.percentage}</div>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceType">Service Type</Label>
                <Select value={formData.serviceType} onValueChange={(val) => updateField('serviceType', val)}>
                  <SelectTrigger id="serviceType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KPay">KPay</SelectItem>
                    <SelectItem value="WavePay">WavePay</SelectItem>
                  </SelectContent>
                </Select>
                {addRuleFormError.serviceType && <div className="text-sm text-red-600">{addRuleFormError.serviceType}</div>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="inOutType">In/Out Type</Label>
                <Select value={formData.inOutType} onValueChange={(val) => updateField('inOutType', val)}>
                  <SelectTrigger id="inOutType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">Received (Cash Out)</SelectItem>
                    <SelectItem value="OUT">Transfer</SelectItem>
                  </SelectContent>
                </Select>
                {addRuleFormError.inOutType && <div className="text-sm text-red-600">{addRuleFormError.inOutType}</div>}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled={rateMutateLoading} type="button" variant="custom" onClick={handleSubmit}>
              {
                rateMutateLoading && <div className='w-4 h-4 rounded-full border-2 border-t-transparent animate-spin'></div>
              }
              Save Requirement
              </Button>
          </DialogFooter>
        </DialogContent>
  )
}

export default AddTransactionRule