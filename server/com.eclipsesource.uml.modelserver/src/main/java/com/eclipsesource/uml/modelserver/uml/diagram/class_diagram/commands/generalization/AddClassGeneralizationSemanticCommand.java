package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Generalization;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;

public class AddClassGeneralizationSemanticCommand extends UmlSemanticElementCommand {

   protected final Generalization newGeneralization;
   protected final Class source;
   protected final Class target;

   public AddClassGeneralizationSemanticCommand(final EditingDomain domain, final URI modelUri,
      final Class source, final Class target) {
      super(domain, modelUri);
      this.newGeneralization = UMLFactory.eINSTANCE.createGeneralization();
      this.source = source;
      this.target = target;
   }

   @Override
   protected void doExecute() {
      source.getGeneralizations().add(getNewGeneralization());
      getNewGeneralization().setGeneral(source);
      getNewGeneralization().setSpecific(target);
   }

   public Generalization getNewGeneralization() { return newGeneralization; }

}
