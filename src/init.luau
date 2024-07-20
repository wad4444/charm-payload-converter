function isConverted(value)
	return type(value) == "table" and  value.__exists ~= nil
end

local NONE = { __none = "__none" }

local function isNone(value: any): boolean
	return type(value) == "table" and value.__none == "__none"
end

local function deepCopy(object)
	local copy = {}
	for key, value in pairs(object) do
		if type(value) == "table" then
			copy[key] = deepCopy(value)
		else
			copy[key] = value
		end
	end
	return copy
end

local function convertValue(value)
	if isNone(value) then
		return {
			__exists = false,
		}
	end

	if type(value) == "table" then
		for i, v in value do
			value[i] = convertValue(v)
		end
	end
	return {
		__exists = true,
		value = value,
	}
end

local function restoreValue(value)
	if isConverted(value) then
		return if value.__exists == false then NONE else restoreValue(value.value)
	end

	if type(value) == "table" then
		for i, v in value do
			value[i] = restoreValue(v)
		end
	end

	return value
end

function toSerializeablePayload(payload)
	payload = deepCopy(payload)
	if payload.type == "init" then
		return payload
	end
	
	payload.data = {
		__exists = true,
		value = payload.data
	}
	convertValue(payload.data.value)
	
	return payload
end

function fromSerializeablePayload(payload)
	payload = deepCopy(payload)
	if payload.type == "init" then
		return payload
	end
	
	payload.data = payload.data.value

	restoreValue(payload.data)
	return payload
end

return {
	toSerializeablePayload = toSerializeablePayload,
	fromSerializeablePayload = fromSerializeablePayload,
}