export const formComponents = [
    {
        "form": {
            "key": "Screen",
            "type": "Screen",
            "props": {},
            "children": [
                {
                    "key": "name",
                    "type": "RsInput",
                    "props": {
                        "label": {
                            "value": "Name"
                        },
                        "placeholder": {
                            "value": "Enter you name"
                        }
                    },
                    "schema": {
                        "validations": [
                            {
                                "key": "required"
                            }
                        ]
                    },
                    "tooltipProps": {
                        "text": {
                            "value": "Name"
                        }
                    }
                },
                {
                    "key": "TiptapTextEditor 1",
                    "type": "TiptapTextEditor",
                    "props": {}
                }
            ]
        },
        "errorType": "RsErrorMessage",
        "languages": [
            {
                "bidi": "ltr",
                "code": "en",
                "name": "English",
                "dialect": "US",
                "description": "American English"
            }
        ],
        "tooltipType": "RsTooltip",
        "localization": {},
        "defaultLanguage": "en-US"
    },
    {
        "name": "Test1",
        "TiptapTextEditor 1": "<p><strong>Test2</strong></p>"
    }
]