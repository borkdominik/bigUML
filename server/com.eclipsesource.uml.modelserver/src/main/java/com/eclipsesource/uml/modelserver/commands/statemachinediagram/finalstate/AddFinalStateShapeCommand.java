package com.eclipsesource.uml.modelserver.commands.statemachinediagram.finalstate;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.FinalState;
import org.eclipse.uml2.uml.PackageableElement;

import java.util.function.Supplier;

public class AddFinalStateShapeCommand extends UmlNotationElementCommand {

    protected final GPoint shapePosition;
    protected String semanticProxyUri;
    protected Supplier<FinalState> finalStateSupplier;

    private AddFinalStateShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
        super(domain, modelUri);

        this.shapePosition = position;
        this.finalStateSupplier = null;
        this.semanticProxyUri = null;
    }

    public AddFinalStateShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
                                     final String semanticProxyUri) {
        this(domain, modelUri, position);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddFinalStateShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
                                     final Supplier<FinalState> stateSupplier) {

        this(domain, modelUri, position);
        this.finalStateSupplier = stateSupplier;
    }

    @Override
    protected void doExecute() {
        Shape newShape = UnotationFactory.eINSTANCE.createShape();
        newShape.setPosition(shapePosition);

        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (semanticProxyUri != null) {
            proxy.setUri(semanticProxyUri);
        } else {
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri((PackageableElement) finalStateSupplier.get()));
        }
        newShape.setSemanticElement(proxy);
        umlDiagram.getElements().add(newShape);
    }
}
