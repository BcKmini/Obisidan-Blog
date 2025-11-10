package com.example.colors

import android.graphics.Color
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.textfield.TextInputEditText

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        findViewById<Button>(R.id.color_creator_button)?.setOnClickListener {
            var redChannelText = findViewById<TextInputEditText>(R.id.red_channel)?.text?.toString()?.trim().orEmpty()
            var greenChannelText = findViewById<TextInputEditText>(R.id.green_channel)?.text?.toString()?.trim().orEmpty()
            var blueChannelText = findViewById<TextInputEditText>(R.id.blue_channel)?.text?.toString()?.trim().orEmpty()

            // Ensure values are present
            if (redChannelText.isEmpty() || greenChannelText.isEmpty() || blueChannelText.isEmpty()) {
                Toast.makeText(this, "All Values are required", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }

            // Normalize to uppercase
            redChannelText = redChannelText.uppercase()
            greenChannelText = greenChannelText.uppercase()
            blueChannelText = blueChannelText.uppercase()

            // If only 1 hex char entered, duplicate it (e.g., "F" -> "FF")
            if (redChannelText.length == 1) redChannelText = redChannelText + redChannelText
            if (greenChannelText.length == 1) greenChannelText = greenChannelText + greenChannelText
            if (blueChannelText.length == 1) blueChannelText = blueChannelText + blueChannelText

            val colorToDisplay = redChannelText + greenChannelText + blueChannelText

            try {
                val colorAsInt = Color.parseColor("#" + colorToDisplay)
                findViewById<TextView>(R.id.color_creator_display)?.setBackgroundColor(colorAsInt)
            } catch (ex: IllegalArgumentException) {
                Toast.makeText(this, getString(R.string.invalid_characters_found), Toast.LENGTH_LONG).show()
            }
        }
    }
}

