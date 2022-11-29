package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.generalization;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.uml2.uml.Classifier;

import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;

public class AddGeneralizationContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "class:add_generalization";
   public static final String GENERAL_CLASS_ELEMENT_ID = "general_class_semantic_element_id";
   public static final String SPECIFIC_CLASS_ELEMENT_ID = "specific_class_semantic_element_id";

   public static CCompoundCommand create(final Classifier specific, final Classifier general) {
      var command = CCommandFactory.eINSTANCE.createCompoundCommand();

      command.setType(TYPE);
      command.getProperties().put(GENERAL_CLASS_ELEMENT_ID, SemanticElementAccessor.getId(general));
      command.getProperties().put(SPECIFIC_CLASS_ELEMENT_ID, SemanticElementAccessor.getId(specific));

      return command;
   }

   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var elementAccessor = new SemanticElementAccessor(modelUri, domain);

      var generalClassElementId = command.getProperties().get(GENERAL_CLASS_ELEMENT_ID);
      var specificClasElementId = command.getProperties().get(SPECIFIC_CLASS_ELEMENT_ID);

      var general = elementAccessor.getElement(generalClassElementId, Classifier.class);
      var specific = elementAccessor.getElement(specificClasElementId, Classifier.class);

      return new AddGeneralizationCompoundCommand(domain, modelUri, specific, general);
   }

}
