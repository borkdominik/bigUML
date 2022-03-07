package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.device;

import java.util.function.Supplier;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Device;

import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;

public class AddDeviceShapeCommand extends UmlNotationElementCommand {

    protected Supplier<Device> deviceSupplier;
    protected final GPoint shapePosition;
    protected String semanticProxyUri;

    private AddDeviceShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
        super(domain, modelUri);
        this.shapePosition = position;
        this.deviceSupplier = null;
        this.semanticProxyUri = null;
    }

    public AddDeviceShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
                                 final String semanticProxyUri) {
        this(domain, modelUri, position);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddDeviceShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
                                 final Supplier<Device> deviceSupplier) {
        this(domain, modelUri, position);
        this.deviceSupplier = deviceSupplier;

    }

    @Override
    protected void doExecute() {
        Shape newShape = UnotationFactory.eINSTANCE.createShape();
        newShape.setPosition(this.shapePosition);
        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(deviceSupplier.get()));
        }
        newShape.setSemanticElement(proxy);
        umlDiagram.getElements().add(newShape);
    }

}
