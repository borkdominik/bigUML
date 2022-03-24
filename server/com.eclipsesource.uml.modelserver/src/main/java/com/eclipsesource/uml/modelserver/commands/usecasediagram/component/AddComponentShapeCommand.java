package com.eclipsesource.uml.modelserver.commands.usecasediagram.component;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Component;

import java.util.function.Supplier;

public class AddComponentShapeCommand extends UmlNotationElementCommand {

    protected final GPoint shapePosition;
    protected String semanticProxyUri;
    protected Supplier<Component> componentSupplier;

    private AddComponentShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
        super(domain, modelUri);
        this.componentSupplier = null;
        this.semanticProxyUri = null;
        this.shapePosition = position;
    }

    public AddComponentShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
                                     final String semanticProxyUri) {
        this(domain, modelUri, position);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddComponentShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
                                     final Supplier<Component> componentSupplier) {
        this(domain, modelUri, position);
        this.componentSupplier = componentSupplier;
    }

    @Override
    protected void doExecute() {
        Shape newShape = UnotationFactory.eINSTANCE.createShape();
        newShape.setPosition(this.shapePosition);

        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(componentSupplier.get()));
        }
        newShape.setSemanticElement(proxy);

        umlDiagram.getElements().add(newShape);
    }
}
