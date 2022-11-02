# Playing with SWR and making multiple requests in one hook

Inspired by https://github.com/vercel/swr/discussions/786#discussioncomment-1436230 thread on SWR
repo I played around it.

## tldr;

Using `Promise.allSettled` is promising, but still we're not able to get results "pushed" after
resolving each promise (daaah!)
