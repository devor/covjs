const { cov, Covenant } = require("./cov");

describe("#on", () => {
  it("adds event listeners for all future events", () => {
    const callback = jest.fn();
    cov.on("asdf", callback);

    cov.signal("asdf");
    expect(callback).toHaveBeenCalledTimes(1);

    cov.signal("asdf");
    expect(callback).toHaveBeenCalledTimes(2);
  });

  itHandlesInvalidArguments("on");
});

describe("#once", () => {
  it("adds event listeners for only the next one future events", () => {
    const callback = jest.fn();
    cov.once("dave", callback);

    cov.signal("dave");
    expect(callback).toHaveBeenCalledTimes(1);

    cov.signal("dave");
    expect(callback).toHaveBeenCalledTimes(1);
  });

  itHandlesInvalidArguments("once");
});

describe("#off", () => {
  it("removes all listeners for a specified events", () => {
    const callback = jest.fn();
    const callback2 = jest.fn();
    cov.on("pete", callback);
    cov.on("pete", callback2);

    cov.signal("pete");
    cov.signal("pete");
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback2).toHaveBeenCalledTimes(2);

    cov.off("pete");

    cov.signal("pete");
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback2).toHaveBeenCalledTimes(2);
  });

  describe("when passing a specific listener", () => {
    it("leaves other listeners in place", () => {
      const callback = jest.fn();
      const callback2 = jest.fn();

      const listener1 = cov.on("abc.def", callback);
      cov.on("abc.def", callback2);

      cov.signal("abc.def");
      cov.signal("abc.def");
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback2).toHaveBeenCalledTimes(2);

      cov.off("abc.def", listener1);

      cov.signal("abc.def");
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback2).toHaveBeenCalledTimes(3);
    });
  });

  it("does nothing when no event name is passed", () => {
    const callback = jest.fn();
    cov.on("something", callback);

    cov.off();

    cov.signal("something");
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("#signal", () => {
  it("calls all previously registered callbacks", () => {
    const callback = jest.fn();
    const callback2 = jest.fn();

    cov.on("jump", callback);
    cov.once("jump", callback2);

    cov.signal("jump");

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);

    cov.signal("jump");

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it("passes supplied arguments to callbacks", () => {
    const callback = jest.fn();
    cov.on("dance", callback);

    cov.signal("dance", ["ballet"]);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith("ballet");

    cov.signal("dance", [
      "ballroom",
      {
        type: "foxtrot",
      },
    ]);

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith("ballroom", {
      type: "foxtrot",
    });
  });

  it("does nothing when no event name is passed", () => {
    const callback = jest.fn();
    cov.on("anything", callback);

    cov.signal();

    expect(callback).not.toHaveBeenCalled();
  });
});

describe("multiple instances", () => {
  it("Calling off on one instance leaves the other instance unaffected", () => {
    const cov1 = new Covenant();
    const cov2 = new Covenant();
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    cov1.on("fizbuzz", callback1);
    cov2.on("fizbuzz", callback2);

    cov1.off("fizbuzz");

    cov1.signal("fizbuzz");
    cov2.signal("fizbuzz");

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it("signaling on on instance does not call any callbacks on other instances", () => {
    const cov1 = new Covenant();
    const cov2 = new Covenant();
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    cov1.on("foobar", callback1);
    cov2.on("foobar", callback2);

    cov1.signal("foobar");
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();
  });
});

function itHandlesInvalidArguments(methodName) {
  describe("invalid arguments", () => {
    it("returns false with no arguments", () => {
      expect(cov[methodName]()).toBe(false);
    });

    it("returns false when no callback is passed in", () => {
      expect(cov[methodName]("whoops")).toBe(false);
    });

    it("returns false when callback is not a function", () => {
      expect(cov[methodName]("oh.no", "nOtAfUnCtIoN")).toBe(false);
    });
  });
};
