--Compiled with roblox-ts v2.1.0
local TS = _G[script]
local Signal = TS.import(script, TS.getModule(script, "@rbxts", "signal"))
local logPrefix = "[RSM]: "
local RSM = {}
do
	local _container = RSM
	local Indicator
	do
		local _inverse = {}
		Indicator = setmetatable({}, {
			__index = _inverse,
		})
		Indicator.Defer = "*RSM_DEFER_STATE"
		_inverse["*RSM_DEFER_STATE"] = "Defer"
	end
	local _binding = Indicator
	local Defer = _binding.Defer
	_container.Defer = Defer
	local StateMachine
	do
		StateMachine = setmetatable({}, {
			__tostring = function()
				return "StateMachine"
			end,
		})
		StateMachine.__index = StateMachine
		function StateMachine.new(...)
			local self = setmetatable({}, StateMachine)
			return self:constructor(...) or self
		end
		function StateMachine:constructor(initialState, options)
			self.options = options
			self.stateChanged = Signal.new()
			self.deferred = false
			self.state = initialState
		end
		function StateMachine:get()
			return self.state
		end
		function StateMachine:transition(name, ...)
			local args = { ... }
			if self.deferred then
				return nil
			end
			local method = self[name]
			method(self, unpack(args))
			self.deferred = false
		end
		function StateMachine:onStateChanged(callback)
			return self.stateChanged:Connect(function(from, to)
				local indicator = callback(from, to)
				if indicator == nil then
					return nil
				end
				repeat
					if indicator == (Indicator.Defer) then
						self.deferred = true
						break
					end
				until true
			end)
		end
		function StateMachine:change(from, to)
			if self.deferred then
				return nil
			end
			if self.state ~= from and from ~= "*" then
				local _result = self.options
				if _result ~= nil then
					_result = _result.warnInvalidState
				end
				return if _result == nil then nil else warn(logPrefix .. ('Invalid state change! Attempt to change from "' .. (tostring(from) .. ('" to "' .. (tostring(to) .. '".')))))
			end
			local oldState = self.state
			self.state = to
			self.stateChanged:Fire(oldState, self.state)
		end
	end
	_container.StateMachine = StateMachine
end
return RSM
