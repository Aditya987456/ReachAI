

### Important concepts during building this project.
* state = backend storage → “keep everything safe for later.”

* emit = visible output → “show/send only the important part now.”




* map(callback) callback parameters

When you do:

array.map((item, index) => {})


The callback receives:

item → current element of array

index → position of the item (always starts from 0)





### Why use <Link> instead of <li> or <a>?
> Benefits:

✔ Single-page navigation
✔ No reload
✔ Faster transitions
✔ SEO-friendly
✔ Less layout flash
✔ Works with App Router caching



---

### 💡 Easy Rule of Thumb
> 🔗 Use <Link /> when:

- User clicks to go somewhere

- It’s obvious navigation

- It’s a static path

> 🧭 Use useRouter() when:

- Trigger is caused by JS logic

- You need to redirect after an action

- You don't want the user to click anything

- The path is dynamic or conditional




---

### why key needed in list mainly using .map
> key is a unique identifier React needs to correctly update list items without confusing them.

React uses key to identify each element uniquely inside a .map().

It helps React know which item changed, added, or removed.

Without a unique key, React may mix up items, causing UI glitches.

Using key={EachTab.id} is perfect because IDs are stable and unique.



## typescript doubt-
Example 1: Laptop object
const laptop = {
  brand: "Apple",
  ram: 16,
  SSD: 512
};


typeof laptop → the object shape:

{
  brand: string;
  ram: number;
  SSD: number;
}


keyof typeof laptop → only the keys:

"brand" | "ram" | "SSD"


You can now do:

type LaptopKeys = keyof typeof laptop;

> now after that -
let key: LaptopKeys;

key = "brand"; // ✔ allowed
key = "ram";   // ✔ allowed
key = "SSD";   // ✔ allowed
key = "model"; //not allowed.





## Polling MUST continue (keep trying), unless:

- Job finished (completed)
- Job failed (failed)
- Component unmounted (cleanup)


### Simple Explanation
Mounting → When a component first appears on the screen.

Updating → When the component re-renders because props/state changed.

Unmounting → When the component is removed from the screen.

> Think of it like putting up and taking down a poster:

Mount = you hang the poster.

Update = you change the poster’s content.

Unmount = you take the poster off the wall.


> react HOOk
If a function uses useState, useEffect, or other hooks inside it…
that function MUST be named starting with use



### What does throw error mean in plain JavaScript?
Code after throw does not run

Control jumps to the nearest catch

If there is no catch, the function crashes

That’s pure JavaScript behavior.

### What does throw error mean inside a Motia event handler?
In Motia, handler is not just a function —
it’s a job executed by a queue.

So Motia interprets throw error as:

“This event execution FAILED.”

```
Handler throws error
        ↓
Is retry left?
        ↓
YES → wait 60s → retry event
NO  → drop event forever
```








```

//will use this code later--

<tr>
  <td style="padding:20px 8px;">
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="
        background:#111;
        border-radius:10px;
        border-collapse:separate;
        border-spacing:0;
        overflow:hidden;
      "
    >
      <tr>
        <td style="padding:30px;text-align:center;">

          <!-- Heading -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td
                style="
                  font-size:20px;
                  font-weight:700;
                  color:#ffffff;
                  padding-bottom:8px;
                  line-height:26px;
                  font-family: Arial, Helvetica, sans-serif;
                "
              >
                You're All Set! <span style="line-height:26px;">🎉</span>
              </td>
            </tr>
          </table>

          <!-- Description -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td
                style="
                  font-size:14px;
                  color:#d1d5db;
                  line-height:22px;
                  font-family: Arial, Helvetica, sans-serif;
                "
              >
                Use these optimized titles, descriptions, tags, and hashtags to boost your video performance.
                <br><br>
                Want metadata for more videos? Come back anytime!
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </td>
</tr>

```


