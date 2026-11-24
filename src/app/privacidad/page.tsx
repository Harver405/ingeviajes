import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/brand/Logo";
import Footer from "@/components/layout/Footer";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Política de tratamiento de datos personales",  
  description: `Política de tratamiento de datos personales de ${site.legalName}, conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013.`,
  alternates: { canonical: "/privacidad" },
};

/* Fecha en que se publica esta versión de la política. Actualízala si cambias el texto. */
const VIGENCIA = "24 de noviembre de 2026";

export default function PrivacyPage() {
  return (
    <>
      <header className="border-b border-line bg-paper">
        <div className="container-site flex items-center justify-between py-4">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-carbon transition-colors hover:text-ink"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="bg-paper py-16 md:py-24">
        <article className="container-site max-w-3xl text-carbon [&_a]:font-semibold [&_a]:text-lima-ink [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-14 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-ink [&_li]:mt-2 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
          <h1 className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em] text-ink">
            Política de tratamiento de datos personales
          </h1>
          <p className="text-muted">Vigente desde el {VIGENCIA}.</p>

          <h2>1. Responsable del tratamiento</h2>
          <ul>
            <li>
              <strong>Razón social:</strong> {site.legalName}
            </li>
            <li>
              <strong>NIT:</strong> {site.nit}
            </li>
            <li>
              <strong>Registro Nacional de Turismo (RNT):</strong> {site.rnt}
            </li>
            <li>
              <strong>Domicilio:</strong> {site.address ? `${site.address}, ` : ""}
              {site.city}
            </li>
            <li>
              <strong>Correo electrónico:</strong> <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <strong>Teléfono y WhatsApp:</strong> <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a>
            </li>
          </ul>

          <h2>2. Marco legal</h2>
          <p>
            Esta política se expide en cumplimiento del artículo 15 de la Constitución Política de Colombia, la Ley
            Estatutaria 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto Único Reglamentario 1074 de
            2015) y las demás normas que los modifiquen, adicionen o complementen.
          </p>

          <h2>3. Definiciones</h2>
          <ul>
            <li>
              <strong>Titular:</strong> persona natural cuyos datos personales son objeto de tratamiento.
            </li>
            <li>
              <strong>Dato personal:</strong> cualquier información vinculada o que pueda asociarse a una o varias
              personas naturales determinadas o determinables.
            </li>
            <li>
              <strong>Dato sensible:</strong> aquel que afecta la intimidad del titular o cuyo uso indebido puede
              generar su discriminación, como los datos relativos a la salud.
            </li>
            <li>
              <strong>Tratamiento:</strong> cualquier operación sobre datos personales, como la recolección,
              almacenamiento, uso, circulación o supresión.
            </li>
            <li>
              <strong>Autorización:</strong> consentimiento previo, expreso e informado del titular para el
              tratamiento de sus datos.
            </li>
            <li>
              <strong>Responsable del tratamiento:</strong> persona que decide sobre la base de datos y su
              tratamiento; en este caso, {site.legalName}.
            </li>
            <li>
              <strong>Encargado del tratamiento:</strong> persona que realiza el tratamiento por cuenta del
              responsable.
            </li>
            <li>
              <strong>Transferencia y transmisión:</strong> envío de datos a un responsable (transferencia) o a un
              encargado (transmisión), dentro o fuera de Colombia.
            </li>
          </ul>

          <h2>4. Principios</h2>
          <p>
            En el tratamiento de datos personales aplicamos los principios de legalidad, finalidad, libertad,
            veracidad o calidad, transparencia, acceso y circulación restringida, seguridad y confidencialidad
            establecidos en el artículo 4 de la Ley 1581 de 2012.
          </p>

          <h2>5. Datos que tratamos y cómo los obtenemos</h2>
          <p>
            Este sitio web <strong>no tiene formularios ni solicita datos personales</strong>. Recibimos datos
            personales únicamente cuando el titular nos contacta por WhatsApp, teléfono, correo electrónico o redes
            sociales, o cuando contrata o participa en nuestros servicios. Según el caso, podemos tratar:
          </p>
          <ul>
            <li>Datos de identificación: nombre, tipo y número de documento, fecha de nacimiento y nacionalidad.</li>
            <li>Datos de contacto: teléfono, correo electrónico y ciudad.</li>
            <li>Datos académicos o laborales: institución, programa académico, cargo o empresa.</li>
            <li>
              Datos necesarios para el viaje: número y vigencia del pasaporte, visas, contacto de emergencia y
              preferencias de alimentación.
            </li>
            <li>
              Datos sensibles relacionados con la salud (por ejemplo, alergias o condiciones médicas), solo cuando
              sean necesarios para la seguridad del titular durante el viaje.
            </li>
            <li>Fotografías y videos tomados durante las experiencias.</li>
          </ul>

          <h2>6. Finalidades del tratamiento</h2>
          <ol>
            <li>Atender solicitudes de información y elaborar cotizaciones.</li>
            <li>
              Organizar y ejecutar los viajes y servicios contratados: reservas de transporte y alojamiento, seguros
              de viaje, visitas técnicas y académicas, y trámites ante consulados o embajadas cuando aplique.
            </li>
            <li>Comunicarnos con los titulares antes, durante y después de cada viaje.</li>
            <li>Atender emergencias y velar por la seguridad de los participantes durante el viaje.</li>
            <li>Cumplir obligaciones legales, contractuales, contables y tributarias.</li>
            <li>
              Publicar fotografías y videos de las experiencias en este sitio web y en nuestras redes sociales, con la
              autorización del titular o de su representante legal.
            </li>
            <li>
              Enviar información sobre próximas salidas y servicios, cuando el titular lo haya autorizado. El titular
              puede pedir en cualquier momento que dejemos de enviarle esta información.
            </li>
          </ol>

          <h2>7. Datos sensibles</h2>
          <p>
            El titular no está obligado a autorizar el tratamiento de datos sensibles. Cuando los solicitemos, le
            informaremos cuáles son, que su entrega es facultativa y la finalidad para la que se usarán. Solo los
            trataremos con su autorización expresa, salvo en los casos de excepción previstos en el artículo 6 de la
            Ley 1581 de 2012.
          </p>

          <h2>8. Datos de niñas, niños y adolescentes</h2>
          <p>
            Cuando en los viajes participen menores de edad, el tratamiento de sus datos respetará su interés superior
            y sus derechos fundamentales, conforme al artículo 7 de la Ley 1581 de 2012 y al artículo 12 del Decreto
            1377 de 2013. La autorización será otorgada por su representante legal, y se tendrá en cuenta la opinión
            del menor según su madurez y capacidad de entendimiento.
          </p>

          <h2>9. Autorización</h2>
          <p>
            Solicitamos la autorización del titular de forma previa, expresa e informada, por escrito, por medios
            electrónicos o mediante conductas inequívocas que permitan concluir que la otorgó. Conservamos prueba de
            dicha autorización. No se requiere autorización en los casos previstos en el artículo 10 de la Ley 1581
            de 2012.
          </p>

          <h2>10. Derechos de los titulares</h2>
          <p>De acuerdo con el artículo 8 de la Ley 1581 de 2012, el titular tiene derecho a:</p>
          <ol>
            <li>Conocer, actualizar y rectificar sus datos personales.</li>
            <li>Solicitar prueba de la autorización otorgada, salvo cuando la ley no la exija.</li>
            <li>Ser informado sobre el uso que se ha dado a sus datos personales.</li>
            <li>
              Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a la ley, una vez
              agotado el trámite de consulta o reclamo ante {site.legalName}.
            </li>
            <li>
              Revocar la autorización y solicitar la supresión de sus datos, cuando no exista un deber legal o
              contractual que impida eliminarlos.
            </li>
            <li>Acceder en forma gratuita a sus datos personales que hayan sido objeto de tratamiento.</li>
          </ol>

          <h2>11. Deberes de {site.legalName}</h2>
          <p>
            Cumplimos los deberes del artículo 17 de la Ley 1581 de 2012. Entre ellos: garantizar al titular el
            ejercicio de sus derechos, conservar la prueba de la autorización, informar la finalidad del tratamiento,
            conservar la información con las medidas de seguridad necesarias, mantenerla actualizada y tramitar las
            consultas y reclamos en los plazos de ley.
          </p>

          <h2>12. Transferencia y transmisión de datos</h2>
          <p>
            Para prestar nuestros servicios, podemos compartir los datos estrictamente necesarios con aerolíneas,
            hoteles, aseguradoras, operadores turísticos, instituciones y empresas anfitrionas, y autoridades
            consulares, dentro o fuera de Colombia. Las transferencias internacionales se realizan cuando son
            necesarias para la ejecución del contrato entre el titular y {site.legalName}, o con la autorización del
            titular, conforme al artículo 26 de la Ley 1581 de 2012.
          </p>

          <h2>13. Uso de este sitio web</h2>
          <ul>
            <li>
              El sitio <strong>no usa cookies de seguimiento ni de publicidad</strong>. Solo guarda en el navegador,
              de forma temporal, una marca para no volver a mostrar el anuncio emergente durante la misma visita.
            </li>
            <li>
              Algunas fotografías se cargan desde los servidores de Meta (Facebook), y el video se reproduce desde
              YouTube solo cuando el visitante lo activa. Estos servicios pueden recibir datos técnicos como la
              dirección IP y se rigen por sus propias políticas de privacidad.
            </li>
            <li>
              Los botones de WhatsApp abren una conversación en esa aplicación. Los datos que el titular comparta
              allí se tratan conforme a esta política.
            </li>
            <li>
              El proveedor de alojamiento del sitio puede registrar datos técnicos de las visitas (dirección IP, tipo
              de navegador, fecha y hora) con fines de seguridad y funcionamiento.
            </li>
          </ul>

          <h2>14. Área responsable de consultas y reclamos</h2>
          <p>
            La atención de consultas, reclamos y solicitudes sobre datos personales está a cargo de {site.legalName},
            a través de los siguientes canales:
          </p>
          <ul>
            <li>
              Correo electrónico: <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              Teléfono y WhatsApp: <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a>
            </li>
          </ul>

          <h2>15. Procedimiento para consultas y reclamos</h2>
          <h3>Consultas</h3>
          <p>
            El titular o sus causahabientes pueden consultar la información personal que repose en nuestras bases de
            datos. La consulta será atendida en un término máximo de diez (10) días hábiles contados a partir de su
            recibo. Si no es posible atenderla en ese término, informaremos los motivos de la demora y la fecha de
            respuesta, que no superará cinco (5) días hábiles siguientes al vencimiento del primer término.
          </p>
          <h3>Reclamos</h3>
          <p>
            Cuando el titular considere que su información debe ser corregida, actualizada o suprimida, o advierta un
            presunto incumplimiento de la ley, podrá presentar un reclamo que contenga: identificación del titular,
            descripción de los hechos, dirección o medio de contacto para la respuesta, y los documentos que quiera
            hacer valer.
          </p>
          <ul>
            <li>
              Si el reclamo está incompleto, pediremos subsanarlo dentro de los cinco (5) días siguientes a su
              recibo. Si pasan dos (2) meses sin que se presente la información requerida, se entenderá que el
              titular desistió del reclamo.
            </li>
            <li>
              El reclamo será atendido en un término máximo de quince (15) días hábiles contados a partir del día
              siguiente a su recibo. Si no es posible atenderlo en ese término, informaremos los motivos y la nueva
              fecha, que no superará ocho (8) días hábiles siguientes al vencimiento del primer término.
            </li>
          </ul>
          <p>
            El titular solo podrá elevar queja ante la Superintendencia de Industria y Comercio una vez haya agotado
            este trámite ante {site.legalName}.
          </p>

          <h2>16. Seguridad de la información</h2>
          <p>
            Adoptamos medidas técnicas, humanas y administrativas razonables para proteger los datos personales y
            evitar su adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.
          </p>

          <h2>17. Vigencia</h2>
          <p>
            Esta política rige a partir del {VIGENCIA}. Los datos personales se conservarán durante el tiempo
            necesario para cumplir las finalidades descritas y las obligaciones legales, contables y tributarias que
            correspondan.
          </p>
          <p>
            Cualquier cambio sustancial en esta política será comunicado oportunamente a los titulares a través de
            este sitio web.
          </p>
        </article>
      </main>

      <Footer />
    </>
  );
}