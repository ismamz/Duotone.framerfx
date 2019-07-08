import * as React from "react"
import {
    Frame,
    ControlType,
    Color,
    addPropertyControls,
    RenderTarget,
} from "framer"

function Empty() {
    return (
        <Frame
            size="100%"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                color: "#8855FF",
                background: "rgba(136, 85, 255, 0.1)",
            }}
        >
            <Icon size={32} color="#8855FF" />

            <div
                style={{
                    fontWeight: 500,
                    fontSize: "1em",
                    marginTop: 10,
                }}
            >
                Choose an image
            </div>
        </Frame>
    )
}

function Thumbnail() {
    return (
        <Frame
            size="100%"
            background="rgba(136, 85, 255, 0.1)"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Icon size={120} color="#8855FF" />
        </Frame>
    )
}

function Icon({ size, color }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill={color}
            viewBox="0 0 24 24"
        >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93H13v-.93zM13 7h5.24c.25.31.48.65.68 1H13V7zm0 3h6.74c.08.33.15.66.19 1H13v-1zm0 9.93V19h2.87c-.87.48-1.84.8-2.87.93zM18.24 17H13v-1h5.92c-.2.35-.43.69-.68 1zm1.5-3H13v-1h6.93c-.04.34-.11.67-.19 1z" />
        </svg>
    )
}

function convertToDueTone(color1, color2) {
    let value = []
    value = value.concat([
        color1[0] / 256 - color2[0] / 256,
        0,
        0,
        0,
        color2[0] / 256,
    ])
    value = value.concat([
        color1[1] / 256 - color2[1] / 256,
        0,
        0,
        0,
        color2[1] / 256,
    ])
    value = value.concat([
        color1[2] / 256 - color2[2] / 256,
        0,
        0,
        0,
        color2[2] / 256,
    ])
    value = value.concat([0, 0, 0, 1, 0])
    return value.join(" ")
}

export function Duotone(props) {
    const { reverse, color1, color2, image, resize } = props

    const c1 = reverse ? Color(color2) : Color(color1)
    const c2 = reverse ? Color(color1) : Color(color2)

    if (RenderTarget.current() === RenderTarget.thumbnail) {
        return <Thumbnail />
    }

    if (image === "") {
        return <Empty />
    }

    return (
        <Frame size={"100%"} background={"transparent"}>
            <svg
                xmlnsXlink="http://www.w3.org/1999/xlink"
                style={{ width: props.width, height: props.height }}
            >
                <filter id="duotone">
                    <feColorMatrix
                        type="matrix"
                        values={convertToDueTone(
                            [c1.r, c1.g, c1.b],
                            [c2.r, c2.g, c2.b]
                        )}
                        colorInterpolationFilters="sRGB"
                    />
                </filter>
                <image
                    width="100%"
                    height="100%"
                    filter="url(#duotone)"
                    xlinkHref={image}
                    x="0"
                    y="0"
                    preserveAspectRatio={`xMidYMid ${resize}`}
                />
            </svg>
        </Frame>
    )
}

Duotone.defaultProps = {
    resize: "slice",
    color1: "#26B7A0",
    color2: "#3D3F4C",
    reverse: false,
    image: "",
}

addPropertyControls(Duotone, {
    image: { type: ControlType.Image, title: "Image" },
    color1: { type: ControlType.Color, title: "Color 1" },
    color2: { type: ControlType.Color, title: "Color 2" },
    reverse: { type: ControlType.Boolean, title: "Reverse" },
    resize: {
        type: ControlType.Enum,
        optionTitles: ["Fill", "Fit"],
        options: ["slice", "meet"],
        title: "Resize",
        hidden(props) {
            return props.image === ""
        },
    },
})
