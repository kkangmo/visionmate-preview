<?php
// Serve the static application on Cloudways PHP stacks.
header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/index.html');
