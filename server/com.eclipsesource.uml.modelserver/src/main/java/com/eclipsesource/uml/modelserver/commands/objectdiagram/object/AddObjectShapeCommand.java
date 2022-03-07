package com.eclipsesource.uml.modelserver.commands.objectdiagram.object;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
//import org.eclipse.uml2.uml.InstanceSpecification;
//import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.NamedElement;
import java.util.function.Supplier;

public class AddObjectShapeCommand extends UmlNotationElementCommand {

    protected final GPoint shapePosition;
    protected String semanticProxyUri;
    //protected Supplier<InstanceSpecification> objectSupplier;
    //protected Supplier<Class> objectSupplier;
    protected Supplier<NamedElement> objectSupplier;

    private AddObjectShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
        super(domain, modelUri);
        this.shapePosition = position;
        this.objectSupplier = null;
        this.semanticProxyUri = null;
    }

    public AddObjectShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
                                  final Supplier<NamedElement> objectSupplier) {
        this(domain, modelUri, position);
        this.objectSupplier = objectSupplier;
    }

    public AddObjectShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
                                  final String semanticProxyUri) {
        this(domain, modelUri, position);
        this.semanticProxyUri = semanticProxyUri;
    }

    @Override
    protected void doExecute() {
        Shape newShape = UnotationFactory.eINSTANCE.createShape();
        newShape.setPosition(this.shapePosition);

        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(objectSupplier.get()));
        }
        newShape.setSemanticElement(proxy);
        umlDiagram.getElements().add(newShape);
    }
}
